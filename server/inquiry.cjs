'use strict';
const {createHash,randomUUID}=require('node:crypto');
const catalog=require('../content/site-content.cjs');
const RECIPIENT='contact@permporn-accessories.com';
// 2 MiB of images expand to about 2.8 MiB in JSON/base64, below Vercel's 4.5 MB limit.
const MAX_BODY=3*1024*1024;
const IMAGE_LIMITS={count:3,each:1024*1024,total:2*1024*1024};
const recent=new Map();
const buckets=new Map();
const emailPattern=/^[^\s@<>(),;:\r\n]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const json=(status,body)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
const problem=(status,code)=>json(status,{success:false,code});
class InputError extends Error{}
class ImageError extends InputError{}
function imageAttachments(images){
  if(images===undefined)return [];
  if(!Array.isArray(images)||images.length>IMAGE_LIMITS.count)throw new ImageError('Invalid images');
  let total=0;
  return images.map((image,index)=>{
    if(!image||typeof image!=='object'||typeof image.content!=='string'||!image.content.length||image.content.length>4*Math.ceil(IMAGE_LIMITS.each/3)||image.content.length%4!==0||!/^[A-Za-z0-9+/]+={0,2}$/.test(image.content))throw new ImageError('Invalid image encoding');
    const content=Buffer.from(image.content,'base64');
    total+=content.length;
    if(!content.length||content.length>IMAGE_LIMITS.each||total>IMAGE_LIMITS.total||content.toString('base64')!==image.content)throw new ImageError('Invalid image size');
    let type,extension;
    if(content.length>=4&&content[0]===0xff&&content[1]===0xd8&&content[2]===0xff&&content.at(-2)===0xff&&content.at(-1)===0xd9){type='image/jpeg';extension='jpg';}
    else if(content.length>=33&&content.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))&&content.toString('ascii',12,16)==='IHDR'){type='image/png';extension='png';}
    else if(content.length>=20&&content.toString('ascii',0,4)==='RIFF'&&content.toString('ascii',8,12)==='WEBP'&&content.readUInt32LE(4)===content.length-8){type='image/webp';extension='webp';}
    if(!type||image.contentType!==type)throw new ImageError('Invalid image type');
    if(typeof image.name!=='string'||image.name.length>150||/[\r\n\0]/.test(image.name))throw new ImageError('Invalid image name');
    const stem=image.name.split(/[\\/]/).pop().replace(/\.[^.]*$/,'').replace(/[^\p{L}\p{N} _-]/gu,'').trim().slice(0,80)||`reference-${index+1}`;
    return {filename:`${stem}.${extension}`,contentType:type,content,contentDisposition:'attachment'};
  });
}
function clean(value,max,multiline=false){
  if(value===undefined||value==='')return '';
  if(typeof value!=='string'||value.length>max||(!multiline&&/[\r\n]/.test(value)))throw new InputError('Invalid field');
  return value.trim();
}
function validate(body){
  if(!body||typeof body!=='object'||Array.isArray(body))throw new InputError('Invalid body');
  if(body.consent!==true||body.website)throw new InputError('Invalid enquiry');
  const out={language:body.language==='en'?'en':'th',name:clean(body.name,100),email:clean(body.email,254),category:clean(body.category,60),item:clean(body.item,30),gem:clean(body.gem,30),shape:clean(body.shape,30),size:clean(body.size,120),metal:clean(body.metal,30),budget:clean(body.budget,120),date:clean(body.date,10),details:clean(body.details,2000,true)};
  if(!emailPattern.test(out.email))throw new InputError('Invalid reply email');
  if(!catalog.collections.some(c=>c.id===out.category))throw new InputError('Invalid collection');
  if(!['loose','other',...catalog.customTypes.map(c=>c.id)].includes(out.item))throw new InputError('Invalid item');
  if(out.shape&&!catalog.shapes.some(s=>s[0]===out.shape))throw new InputError('Invalid shape');
  if(out.gem&&!catalog.gemstones.some(g=>g.id===out.gem))throw new InputError('Invalid gem');
  if(out.metal&&!['925 Silver','9K','14K','18K','Platinum'].includes(out.metal))throw new InputError('Invalid metal');
  if(out.date){
    const day=new Date(out.date+'T00:00:00Z');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(out.date)||!Number.isFinite(day.getTime())||day.toISOString().slice(0,10)!==out.date)throw new InputError('Invalid date');
  }
  if(!['colored-gemstones','custom-jewelry'].includes(out.category))out.gem='';
  if(out.item==='loose'&&out.category!=='custom-jewelry')out.metal='';
  out.attachments=imageAttachments(body.attachments);
  return out;
}
function mailFor(data,sender,id){
  const language=data.language==='en'?1:0;
  const collection=catalog.collections.find(c=>c.id===data.category);
  const item=catalog.customTypes.find(c=>c.id===data.item);
  const gem=catalog.gemstones.find(c=>c.id===data.gem);
  const shape=catalog.shapes.find(s=>s[0]===data.shape);
  const values={...data,category:collection.name[language],item:item?item.name[language]:data.item==='loose'?(language?'Loose stone':'เม็ดเดี่ยว'):(language?'Other / undecided':'อื่น ๆ / ยังไม่แน่ใจ'),gem:gem?gem.name[language]:'',shape:shape?shape[language?2:1]:''};
  const labels={name:'ชื่อ / Name',email:'อีเมลติดต่อกลับ / Reply email',category:'หมวด / Collection',item:'ลักษณะงาน / Item',gem:'ชนิดพลอย / Gemstone',shape:'รูปทรง / Shape',size:'น้ำหนักหรือขนาด / Weight or size',metal:'วัสดุ / Metal',budget:'งบประมาณ / Budget',date:'วันที่ต้องการ / Required date',details:'รายละเอียด / Details'};
  const lines=['PERMPORN ACCESSORIES — Website enquiry',`Reference: ${id}`,''];
  for(const [key,label] of Object.entries(labels))if(values[key])lines.push(`${label}: ${values[key]}`);
  if(data.attachments.length)lines.push(`รูปอ้างอิง / Reference images: ${data.attachments.length}`);
  return {from:{name:'PERMPORN ACCESSORIES Website',address:sender},to:RECIPIENT,replyTo:{name:data.name||'Website visitor',address:data.email},subject:`PERMPORN — สอบถามสินค้า / ${collection.name[1]}`,text:lines.join('\n'),attachments:data.attachments,disableFileAccess:true,disableUrlAccess:true};
}
function gmailOptions(env){
  const user=env.GOOGLE_MAIL_USER||RECIPIENT;
  if(!emailPattern.test(user))return null;
  let auth;
  if(env.GOOGLE_CLIENT_ID&&env.GOOGLE_CLIENT_SECRET&&env.GOOGLE_REFRESH_TOKEN){
    auth={type:'OAuth2',user,clientId:env.GOOGLE_CLIENT_ID,clientSecret:env.GOOGLE_CLIENT_SECRET,refreshToken:env.GOOGLE_REFRESH_TOKEN};
  }else if(env.GOOGLE_APP_PASSWORD){
    auth={user,pass:env.GOOGLE_APP_PASSWORD.replace(/\s/g,'')};
  }else return null;
  return {host:'smtp.gmail.com',port:465,secure:true,auth,connectionTimeout:10000,greetingTimeout:5000,socketTimeout:15000};
}
function allowedOrigins(env){
  const origins=new Set(['https://permporn-accessories.com','https://www.permporn-accessories.com']);
  for(const host of [env.VERCEL_URL,env.VERCEL_BRANCH_URL,env.VERCEL_PROJECT_PRODUCTION_URL])if(host)origins.add('https://'+host);
  for(const origin of (env.CONTACT_ALLOWED_ORIGINS||'').split(','))if(origin.trim())origins.add(origin.trim().replace(/\/$/,''));
  if(env.NODE_ENV!=='production')for(const origin of ['http://127.0.0.1:3000','http://localhost:3000','http://127.0.0.1:4174'])origins.add(origin);
  return origins;
}
function permittedRate(ip,now){
  if(buckets.size>1000)for(const [key,value] of buckets)if(now-value.start>600000)buckets.delete(key);
  const key=createHash('sha256').update(ip||'unknown').digest('hex');
  let bucket=buckets.get(key);
  if(!bucket||now-bucket.start>600000){bucket={start:now,count:0};buckets.set(key,bucket);}
  bucket.count+=1;
  return bucket.count<=5;
}
async function handleInquiry(request,options={}){
  const env=options.env||process.env;
  if(request.method!=='POST')return problem(405,'METHOD_NOT_ALLOWED');
  if(!allowedOrigins(env).has(request.headers.get('origin')))return problem(403,'ORIGIN_NOT_ALLOWED');
  if(!(request.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))return problem(415,'JSON_REQUIRED');
  if(Number(request.headers.get('content-length')||0)>MAX_BODY)return problem(413,'REQUEST_TOO_LARGE');
  let data;
  try{
    const raw=await request.text();
    if(Buffer.byteLength(raw)>MAX_BODY)return problem(413,'REQUEST_TOO_LARGE');
    data=validate(JSON.parse(raw));
  }catch(error){return problem(400,error instanceof ImageError?'INVALID_IMAGES':'INVALID_ENQUIRY');}
  const transportOptions=gmailOptions(env);
  if(!transportOptions)return problem(503,'EMAIL_UNAVAILABLE');
  const now=Date.now();
  for(const [key,value] of recent)if(now-value.time>300000)recent.delete(key);
  const hash=createHash('sha256').update(JSON.stringify({...data,attachments:data.attachments.map(({filename,contentType,content})=>({filename,contentType,sha256:createHash('sha256').update(content).digest('hex')}))}));
  const signature=hash.digest('hex');
  const previous=recent.get(signature);
  if(previous){
    try{return json(200,{success:true,reference:await previous.promise});}
    catch(_){return problem(502,'EMAIL_SEND_FAILED');}
  }
  if(!permittedRate(options.ip||request.headers.get('x-forwarded-for')?.split(',')[0],now))return problem(429,'RATE_LIMITED');
  const id=randomUUID();
  const sender=transportOptions.auth.user;
  const promise=(async()=>{
    const transport=options.createTransport?options.createTransport(transportOptions):require('nodemailer').createTransport(transportOptions);
    const result=await transport.sendMail(mailFor(data,sender,id));
    if(!Array.isArray(result.accepted)||!result.accepted.some(address=>String(address.address||address).toLowerCase()===RECIPIENT))throw new Error('Recipient not accepted');
    return id;
  })();
  recent.set(signature,{time:now,promise});
  try{return json(200,{success:true,reference:await promise});}
  catch(_){
    recent.delete(signature);
    // Do not log customer content, credentials, or SMTP responses.
    return problem(502,'EMAIL_SEND_FAILED');
  }
}
module.exports={handleInquiry,validate,mailFor,gmailOptions,RECIPIENT,MAX_BODY,IMAGE_LIMITS};
