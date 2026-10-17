const test=require('node:test');
const assert=require('node:assert/strict');
const {randomUUID}=require('node:crypto');
const {handleInquiry,RECIPIENT,MAX_BODY,IMAGE_LIMITS}=require('../server/inquiry.cjs');
const origin='https://permporn-accessories.com';
const env={NODE_ENV:'production',GOOGLE_MAIL_USER:RECIPIENT,GOOGLE_APP_PASSWORD:'test-only-not-a-real-password'};
const fixture=()=>({name:'ผู้ทดสอบ',email:'visitor@example.com',category:'custom-jewelry',item:'rings',gem:'emerald',shape:'Oval',size:'2.00 ct',metal:'18K',budget:'50,000 THB',date:'2026-12-15',details:`ต้องการแหวนพลอยสีเขียว\nขอข้อมูลราคา ${randomUUID()}`,language:'th',consent:true,website:''});
const request=(body,headers={},method='POST')=>new Request(origin+'/api/inquiry',{method,headers:{'Origin':origin,'Content-Type':'application/json',...headers},...(method==='POST'?{body:typeof body==='string'?body:JSON.stringify(body)}:{})});
const transport=(capture)=>({sendMail:async message=>{if(capture)capture(message);return {accepted:[RECIPIENT]};}});
test('sends every visible enquiry detail to the fixed recipient with the visitor as Reply-To',async()=>{
  const input={...fixture(),to:'attacker@example.com'};let mail;
  const response=await handleInquiry(request(input),{env,ip:'happy',createTransport:()=>transport(m=>mail=m)});
  assert.equal(response.status,200);assert.equal((await response.json()).success,true);
  assert.equal(mail.to,RECIPIENT);assert.equal(mail.from.address,RECIPIENT);assert.equal(mail.replyTo.address,input.email);
  for(const value of [input.name,input.email,'เครื่องประดับสั่งทำ','แหวน','มรกต','วงรี',input.size,input.metal,input.budget,input.date,input.details])assert.ok(mail.text.includes(value),value);
  assert.equal(mail.disableFileAccess,true);assert.equal(mail.disableUrlAccess,true);
});
test('rejects missing consent, malformed emails, header injection, unknown selections, and invalid dates before SMTP',async()=>{
  for(const bad of [{consent:false},{email:'wrong'},{name:'x\r\nBcc: hidden@example.com'},{email:'a@example.com\nBcc: other@example.com'},{shape:'FakeShape'},{date:'2026-02-31'},{details:'x'.repeat(2001)}]){
    let called=false;
    const response=await handleInquiry(request({...fixture(),...bad}),{env,ip:'validation',createTransport:()=>{called=true;return transport();}});
    assert.equal(response.status,400);assert.equal(called,false);
  }
});
test('rejects external origins, wrong methods, wrong content type, oversized and malformed JSON',async()=>{
  const checks=[[request(fixture(),{Origin:'https://other.example'}),403],[request(null,{},'GET'),405],[request('{}',{'Content-Type':'text/plain'}),415],[request('x'.repeat(MAX_BODY+1)),413],[request('{'),400]];
  for(const [input,status] of checks)assert.equal((await handleInquiry(input,{env})).status,status);
});
test('missing Google credentials returns an unavailable status, never a false success',async()=>{
  const response=await handleInquiry(request(fixture()),{env:{NODE_ENV:'production'}});
  assert.equal(response.status,503);assert.equal((await response.json()).success,false);
});
test('SMTP failures and rejected recipients return an error without leaking the SMTP response',async()=>{
  for(const sendMail of [async()=>{throw new Error('password=should-not-leak');},async()=>({accepted:[],rejected:[RECIPIENT]})]){
    const response=await handleInquiry(request(fixture()),{env,ip:randomUUID(),createTransport:()=>({sendMail})});
    assert.equal(response.status,502);const result=await response.text();assert.ok(!result.includes('should-not-leak'));assert.equal(JSON.parse(result).success,false);
  }
});
test('simultaneous duplicate submissions share one SMTP send and one reference',async()=>{
  const input=fixture();let count=0;
  const options={env,ip:'duplicate',createTransport:()=>({sendMail:async()=>{count++;await new Promise(r=>setTimeout(r,10));return {accepted:[RECIPIENT]};}})};
  const replies=await Promise.all([handleInquiry(request(input),options),handleInquiry(request(input),options)]);
  const results=await Promise.all(replies.map(r=>r.json()));
  assert.equal(count,1);assert.equal(results[0].reference,results[1].reference);
});
test('limits repeated different requests from one warm instance without changing the recipient',async()=>{
  for(let i=0;i<6;i++){
    const response=await handleInquiry(request(fixture()),{env,ip:'rate-test',createTransport:()=>transport()});
    assert.equal(response.status,i===5?429:200);
  }
});
test('Google OAuth credentials can be used instead of an App Password',async()=>{
  let options;
  const response=await handleInquiry(request(fixture()),{env:{NODE_ENV:'production',GOOGLE_MAIL_USER:RECIPIENT,GOOGLE_CLIENT_ID:'test-id',GOOGLE_CLIENT_SECRET:'test-secret',GOOGLE_REFRESH_TOKEN:'test-refresh'},ip:'oauth',createTransport:value=>{options=value;return transport();}});
  assert.equal(response.status,200);assert.equal(options.auth.type,'OAuth2');assert.equal(options.secure,true);assert.equal(options.host,'smtp.gmail.com');
});

const pixel=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aYd8AAAAASUVORK5CYII=','base64');
const image=(extra={})=>({name:'แบบแหวน.png',contentType:'image/png',content:pixel.toString('base64'),...extra});
test('sends image bytes as real MIME attachments with the complete enquiry',async()=>{
  const jpeg=require('node:fs').readFileSync(require('node:path').join(__dirname,'../assets/images/hero-realistic-v2.jpg'));
  let mail;
  const input={...fixture(),attachments:[image(),image({name:'reference.exe',contentType:'image/jpeg',content:jpeg.toString('base64')})]};
  const response=await handleInquiry(request(input),{env,ip:'images',createTransport:()=>transport(value=>mail=value)});
  assert.equal(response.status,200);
  assert.equal(mail.attachments.length,2);assert.deepEqual(mail.attachments[0].content,pixel);assert.deepEqual(mail.attachments[1].content,jpeg);
  assert.equal(mail.attachments[0].filename,'แบบแหวน.png');assert.equal(mail.attachments[1].filename,'reference.jpg');
  assert.ok(mail.text.includes(input.details));assert.ok(mail.text.includes('Reference images: 2'));
  const composer=new (require('nodemailer/lib/mail-composer'))(mail);
  const mime=await new Promise((resolve,reject)=>composer.compile().build((error,result)=>error?reject(error):resolve(result.toString())));
  assert.match(mime,/Content-Type: image\/png/);assert.match(mime,/Content-Type: image\/jpeg/);assert.match(mime,/Content-Disposition: attachment/);
  assert.ok(mime.replace(/\r\n/g,'').includes(pixel.toString('base64')));
});
test('rejects invalid, disguised, too many, and oversized images before SMTP',async()=>{
  const padded=Buffer.alloc(700*1024);pixel.copy(padded);
  const badImages=[null,{},[image(),image(),image(),image()],[image({content:'not base64'})],[image({content:'A'.repeat(104)})],[image({contentType:'image/jpeg'})],[image({content:Buffer.from('<svg></svg>').toString('base64'),contentType:'image/svg+xml'})],[image({name:'x\r\nBcc: attack.png'})],[image({content:Buffer.alloc(IMAGE_LIMITS.each+1).toString('base64')})],Array.from({length:3},()=>image({content:padded.toString('base64')}))];
  for(const attachments of badImages){
    let called=false;
    const response=await handleInquiry(request({...fixture(),attachments}),{env,ip:'bad-images',createTransport:()=>{called=true;return transport();}});
    assert.equal(response.status,400);assert.equal((await response.json()).code,'INVALID_IMAGES');assert.equal(called,false);
  }
});
test('accepts the maximum total image size below the request limit',async()=>{
  const padded=Buffer.alloc(IMAGE_LIMITS.each);pixel.copy(padded);
  const body={...fixture(),attachments:[image({content:padded.toString('base64')}),image({content:padded.toString('base64')})]};
  assert.ok(Buffer.byteLength(JSON.stringify(body))<MAX_BODY);
  assert.equal((await handleInquiry(request(body),{env,ip:'max-images',createTransport:()=>transport()})).status,200);
});
test('different image bytes are not treated as a duplicate enquiry',async()=>{
  const body=fixture();let count=0;
  const options={env,ip:'different-images',createTransport:()=>({sendMail:async()=>{count++;return {accepted:[RECIPIENT]};}})};
  const changed=Buffer.from(pixel);changed[changed.length-1]^=1;
  const results=await Promise.all([image(),image({content:changed.toString('base64')})].map(attachment=>handleInquiry(request({...body,attachments:[attachment]}),options)));
  assert.equal(count,2);assert.ok(results.every(result=>result.status===200));
});
