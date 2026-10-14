// Form submissions go to the site's private Vercel endpoint; no mail credentials live here.
(() => {
  'use strict';
  const form=document.querySelector('#inquiry-form');
  if(!form)return;
  const $=selector=>document.querySelector(selector);
  const locale=()=>document.documentElement.lang==='en'?'en':'th';
  const text=(th,en)=>locale()==='th'?th:en;
  const names=['name','email','category','item','gem','shape','size','metal','budget','date','details'];
  const params=new URLSearchParams(location.search);
  // Only collection preferences are accepted from the URL, never personal information.
  ['category','item','gem','shape','size','metal'].forEach(name=>{
    const value=params.get(name),el=$('#'+name);
    if(!value)return;
    if(el.tagName==='SELECT'){
      if([...el.options].some(o=>o.value===value))el.value=value;
    }else el.value=value.slice(0,el.maxLength);
  });
  if($('#category').value==='custom-jewelry'&&!params.get('item'))$('#item').value='rings';
  const visibility=()=>{
    const category=$('#category').value;
    $('#gem').closest('.form-field').hidden=!['colored-gemstones','custom-jewelry'].includes(category);
    $('#metal').closest('.form-field').hidden=category!=='custom-jewelry'&&$('#item').value==='loose';
  };
  const payload=()=>{
    const out={language:locale(),consent:$('#consent').checked,website:$('#website').value};
    names.forEach(name=>{
      const el=$('#'+name);
      if(!el.closest('.form-field').hidden)out[name]=el.value.trim();
    });
    return out;
  };
  const emailLink=()=>{
    const labels={name:text('ชื่อ','Name'),email:text('อีเมลติดต่อกลับ','Reply email'),category:text('หมวด','Collection'),item:text('ลักษณะงาน','Item'),gem:text('ชนิดพลอย','Gemstone'),shape:text('รูปทรง','Shape'),size:text('น้ำหนัก / ขนาด','Weight / size'),metal:text('วัสดุ','Metal'),budget:text('งบประมาณ','Budget'),date:text('วันที่ต้องการ','Required date'),details:text('รายละเอียด','Details')};
    const rows=[text('สวัสดี เพิ่มพร เครื่องประดับ ขอสอบถามข้อมูลดังนี้','Hello Permporn Accessories, I would like to enquire about:'),''];
    names.forEach(name=>{
      const el=$('#'+name);
      if(el.closest('.form-field').hidden||!el.value.trim())return;
      rows.push(labels[name]+': '+(el.tagName==='SELECT'?el.selectedOptions[0].textContent:el.value.trim()));
    });
    $('#send-email').href='mailto:contact@permporn-accessories.com?subject='+encodeURIComponent(text('สอบถามสินค้าและงานสั่งทำ — PERMPORN','Product and custom jewelry enquiry — PERMPORN'))+'&body='+encodeURIComponent(rows.join('\n'));
    document.querySelectorAll('.contact-option[href^="mailto:"]').forEach(a=>a.href=$('#send-email').href);
  };
  let state='',busy=false;
  const renderStatus=()=>{
    const status=$('#form-status');
    const messages={
      sending:text('กำลังส่งรายละเอียด…','Sending your enquiry…'),
      sent:text('ส่งคำขอแล้ว ทีมงานจะติดต่อกลับทางอีเมลที่คุณระบุ','Your enquiry has been sent. Our team will reply to the email you provided.'),
      rate:text('ส่งคำขอบ่อยเกินไป กรุณารอสักครู่ หรือใช้ปุ่มส่งผ่านแอปอีเมล','Too many requests. Please wait a little or use the email-app option.'),
      invalid:text('กรุณาตรวจสอบอีเมลและรายละเอียด แล้วลองอีกครั้ง','Please check your email and details, then try again.'),
      error:text('ยังส่งคำขอไม่ได้ ข้อมูลที่กรอกยังอยู่ครบ ลองอีกครั้งหรือส่งผ่านแอปอีเมลด้านล่าง','We could not send your enquiry. Your details are still here. Try again or use the email-app option below.')
    };
    status.textContent=messages[state]||'';
    status.dataset.state=state;
  };
  $('#category').addEventListener('change',()=>{
    if($('#category').value==='custom-jewelry'&&$('#item').value==='loose')$('#item').value='rings';
    visibility();emailLink();
  });
  form.addEventListener('input',()=>{if(!busy){state='';renderStatus();}emailLink();});
  form.addEventListener('change',()=>{visibility();emailLink();});
  document.addEventListener('languagechange',()=>{emailLink();renderStatus();});
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(busy||!form.reportValidity())return;
    const requestData=payload();
    busy=true;state='sending';renderStatus();
    $('#send-inquiry').disabled=true;
    form.setAttribute('aria-busy','true');
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),28000);
    try{
      const response=await fetch(form.action,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(requestData),signal:controller.signal});
      const result=await response.json();
      if(response.ok&&result.success===true)state='sent';
      else if(response.status===429)state='rate';
      else if(response.status===400)state='invalid';
      else state='error';
    }catch(_){state='error';}
    finally{
      clearTimeout(timeout);busy=false;
      $('#send-inquiry').disabled=false;
      form.setAttribute('aria-busy','false');
      renderStatus();$('#form-status').focus({preventScroll:true});
    }
  });
  visibility();emailLink();form.hidden=false;
})();
