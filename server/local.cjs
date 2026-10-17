// Local Node preview serves only dist/ and the inquiry endpoint.
const http=require('node:http');
const fs=require('node:fs/promises');
const path=require('node:path');
const {handleInquiry,MAX_BODY}=require('./inquiry.cjs');
const root=path.resolve(__dirname,'..','dist');
const mock=process.argv.includes('--mock-mail');
const port=Number(process.env.PORT||(mock?4174:3000));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
  const url=new URL(req.url,`http://127.0.0.1:${port}`);
  if(url.pathname==='/api/inquiry'){
    const chunks=[];let length=0;
    for await(const chunk of req){length+=chunk.length;if(length>MAX_BODY){res.writeHead(413,{'Content-Type':'application/json'});res.end(JSON.stringify({success:false,code:'REQUEST_TOO_LARGE'}));return;}chunks.push(chunk);}
    const method=req.method||'GET';
    const request=new Request(url,{method,headers:req.headers,...(!['GET','HEAD'].includes(method)?{body:Buffer.concat(chunks)}:{})});
    const options=mock?{env:{GOOGLE_MAIL_USER:'contact@permporn-accessories.com',GOOGLE_APP_PASSWORD:'local-test-only',CONTACT_ALLOWED_ORIGINS:`http://127.0.0.1:${port}`},ip:'local-test',createTransport:()=>({sendMail:async mail=>{
      if(mail.text.includes('MOCK_FAIL'))throw new Error('Simulated SMTP rejection');
      console.log('LOCAL MOCK: received complete enquiry; no email was sent.');
      return {accepted:['contact@permporn-accessories.com']};
    }})}:{ip:req.socket.remoteAddress};
    const response=await handleInquiry(request,options);
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
  }
  try{
    const file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
    if(!file.startsWith(root+path.sep))throw new Error('Outside static root');
    const bytes=await fs.readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
  }catch(_){res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}${mock?' (mock email transport; no messages sent)':''}`));
