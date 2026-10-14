const {handleInquiry}=require('../server/inquiry.cjs');
module.exports=async function inquiry(req,res){
  try{
    const headers=new Headers();
    for(const [key,value] of Object.entries(req.headers))if(value!==undefined)headers.set(key,Array.isArray(value)?value.join(','):String(value));
    const raw=typeof req.body==='string'||Buffer.isBuffer(req.body)?req.body:JSON.stringify(req.body||{});
    const method=req.method||'GET';
    const request=new Request('https://permporn-accessories.com/api/inquiry',{method,headers,...(!['GET','HEAD'].includes(method)?{body:raw}:{})});
    const response=await handleInquiry(request);
    res.statusCode=response.status;
    for(const [key,value] of response.headers)res.setHeader(key,value);
    res.end(await response.text());
  }catch(_){
    res.statusCode=500;
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    res.end(JSON.stringify({success:false,code:'EMAIL_SEND_FAILED'}));
  }
};
