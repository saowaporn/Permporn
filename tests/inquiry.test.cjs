const test=require('node:test');
const assert=require('node:assert/strict');
const {randomUUID}=require('node:crypto');
const {handleInquiry,RECIPIENT}=require('../server/inquiry.cjs');
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
  const checks=[[request(fixture(),{Origin:'https://other.example'}),403],[request(null,{},'GET'),405],[request('{}',{'Content-Type':'text/plain'}),415],[request('x'.repeat(17000)),413],[request('{'),400]];
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
