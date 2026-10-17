// Form submissions go to the site's private Vercel endpoint; no mail credentials live here.
(() => {
  'use strict';
  const form=document.querySelector('#inquiry-form');
  if(!form)return;
  const $=selector=>document.querySelector(selector);
  const locale=()=>document.documentElement.lang==='en'?'en':'th';
  const text=(th,en)=>locale()==='th'?th:en;
  const privacyDialog=$('#privacy-dialog');
  const privacyTrigger=$('#privacy-trigger');
  if(privacyDialog&&privacyTrigger&&typeof privacyDialog.showModal==='function'){
    const consent=$('#consent');
    const privacyConsent=$('#privacy-consent');
    const syncConsent=()=>{privacyConsent.checked=consent.checked;};
    consent.addEventListener('input',syncConsent);
    consent.addEventListener('change',syncConsent);
    syncConsent();
    const privacyBody=$('#privacy-dialog-body');
    $('#privacy').querySelectorAll('p').forEach(p=>privacyBody.append(p.cloneNode(true)));
    privacyTrigger.setAttribute('aria-haspopup','dialog');
    privacyTrigger.setAttribute('aria-controls','privacy-dialog');
    let returnFocus=privacyTrigger;
    privacyTrigger.addEventListener('click',e=>{
      e.preventDefault();
      if(privacyDialog.open)return;
      returnFocus=privacyTrigger;
      syncConsent();
      privacyDialog.showModal();
      privacyBody.scrollTop=0;
      document.documentElement.classList.add('privacy-dialog-open');
    });
    privacyDialog.querySelectorAll('[data-privacy-close]').forEach(button=>{
      button.addEventListener('click',()=>privacyDialog.close());
    });
    privacyConsent.addEventListener('change',()=>{
      consent.checked=privacyConsent.checked;
      consent.dispatchEvent(new Event('input',{bubbles:true}));
      consent.dispatchEvent(new Event('change',{bubbles:true}));
      returnFocus=consent;
      if(privacyConsent.checked&&privacyDialog.open)privacyDialog.close();
    });
    privacyDialog.addEventListener('click',e=>{
      if(e.target!==privacyDialog)return;
      const rect=privacyDialog.getBoundingClientRect();
      if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)privacyDialog.close();
    });
    privacyDialog.addEventListener('close',()=>{
      document.documentElement.classList.remove('privacy-dialog-open');
      returnFocus.focus({preventScroll:true});
    });
  }
  const names=['name','email','category','item','gem','shape','size','metal','budget','date','details'];
  const budget=$('#budget');
  const formatBudget=()=>{
    const raw=budget.value,caret=budget.selectionStart??raw.length;
    const before=raw.slice(0,caret).replace(/[^\d.]/g,'').length;
    const cleaned=raw.replace(/[^\d.]/g,'');
    const [integer,...fractions]=cleaned.split('.');
    const grouped=integer.replace(/^0+(?=\d)/,'').replace(/\B(?=(\d{3})+(?!\d))/g,',');
    const formatted=grouped+(fractions.length?'.'+fractions.join('').slice(0,2):'');
    if(formatted===raw)return;
    budget.value=formatted;
    let position=0,seen=0;
    while(position<formatted.length&&seen<before){if(/[\d.]/.test(formatted[position]))seen++;position++;}
    budget.setSelectionRange(position,position);
  };
  budget.addEventListener('input',e=>{if(!e.isComposing)formatBudget();});
  budget.addEventListener('compositionend',()=>{formatBudget();budget.dispatchEvent(new Event('input',{bubbles:true}));});
  const imageInput=$('#reference-images');
  const images=[];
  let preparingImages=false,imageState='';
  const imageMessages={
    preparing:()=>text('กำลังเตรียมรูปภาพ…','Preparing images…'),
    count:()=>text('แนบได้สูงสุด 3 รูป กรุณาลบรูปเดิมก่อนเพิ่มรูปใหม่','You can attach up to 3 images. Remove an image before adding another.'),
    type:()=>text('กรุณาเลือกรูป JPG, PNG หรือ WebP ที่เปิดดูได้','Please choose a readable JPG, PNG or WebP image.'),
    size:()=>text('กรุณาเลือกรูปต้นฉบับขนาดไม่เกิน 20 MB ต่อรูป','Please choose original images no larger than 20 MB each.'),
    total:()=>text('รูปที่แนบต้องมีขนาดรวมไม่เกิน 2 MB กรุณาเลือกรูปที่เล็กลง','Attached images must total 2 MB or less. Please choose smaller images.')
  };
  const renderImages=()=>{
    const list=$('#image-previews');
    list.replaceChildren();list.hidden=!images.length;
    images.forEach((image,index)=>{
      const item=document.createElement('li');
      const preview=document.createElement('img');preview.src=image.preview;preview.alt=image.name;
      const name=document.createElement('span');name.className='image-name';name.textContent=image.name;
      const remove=document.createElement('button');remove.type='button';remove.textContent=text('ลบรูป','Remove');
      remove.setAttribute('aria-label',text('ลบรูป ','Remove ')+image.name);remove.disabled=preparingImages||busy;
      remove.addEventListener('click',()=>{
        images.splice(index,1);imageState='';state='';renderStatus();renderImages();
        const next=list.querySelectorAll('button')[Math.min(index,images.length-1)];
        (next||imageInput).focus({preventScroll:true});
      });
      item.append(preview,name,remove);list.append(item);
    });
    const status=$('#image-status');
    status.textContent=imageMessages[imageState]?.()||(images.length?text(`แนบแล้ว ${images.length}/3 รูป`,`Attached ${images.length}/3 images`):'');
    status.dataset.state=imageState;
    imageInput.disabled=preparingImages||busy;
    $('#send-inquiry').disabled=preparingImages||busy;
    $('#share-image-note').hidden=!images.length;
  };
  const readImage=file=>new Promise((resolve,reject)=>{
    const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('type'));reader.readAsDataURL(file);
  });
  const prepareImage=async file=>{
    if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('type');
    if(!file.size||file.size>20*1024*1024)throw new Error('size');
    let preview=await readImage(file);
    const decoded=await new Promise((resolve,reject)=>{
      const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('type'));image.src=preview;
    });
    if(!decoded.naturalWidth||!decoded.naturalHeight||decoded.naturalWidth*decoded.naturalHeight>40000000)throw new Error('size');
    let blob=file;
    if(file.size>600*1024||Math.max(decoded.naturalWidth,decoded.naturalHeight)>1600){
      const canvas=document.createElement('canvas');
      for(const longest of [1600,1280,1024]){
        const scale=Math.min(1,longest/Math.max(decoded.naturalWidth,decoded.naturalHeight));
        canvas.width=Math.max(1,Math.round(decoded.naturalWidth*scale));canvas.height=Math.max(1,Math.round(decoded.naturalHeight*scale));
        const context=canvas.getContext('2d');if(!context)throw new Error('type');
        context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(decoded,0,0,canvas.width,canvas.height);
        blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.82));
        if(!blob)throw new Error('type');
        if(blob.size<=600*1024)break;
      }
      preview=await readImage(blob);
    }
    if(blob.size>1024*1024)throw new Error('total');
    const extension=blob.type==='image/jpeg'?'jpg':blob.type==='image/png'?'png':'webp';
    const stem=file.name.replace(/\.[^.]*$/,'').slice(0,100)||'reference';
    return {name:stem+'.'+extension,contentType:blob.type,content:preview.slice(preview.indexOf(',')+1),preview,bytes:blob.size};
  };
  imageInput.addEventListener('change',async()=>{
    const selected=[...imageInput.files];imageInput.value='';
    if(!selected.length||preparingImages||busy)return;
    if(images.length+selected.length>3){imageState='count';renderImages();return;}
    preparingImages=true;imageState='preparing';state='';renderStatus();renderImages();
    try{
      const additions=[];
      for(const file of selected)additions.push(await prepareImage(file));
      if([...images,...additions].reduce((sum,image)=>sum+image.bytes,0)>2*1024*1024)throw new Error('total');
      images.push(...additions);imageState='';
    }catch(error){imageState=imageMessages[error.message]?error.message:'type';}
    finally{preparingImages=false;renderImages();}
  });
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
    if(images.length)out.attachments=images.map(({name,contentType,content})=>({name,contentType,content}));
    return out;
  };
  const message=$('#inquiry-message');
  const sharePanel=$('#inquiry-share');
  const shareToggle=$('#toggle-inquiry-share');
  const copyButton=$('#copy-inquiry');
  let copyState='',copying=false;
  const renderCopy=()=>{
    $('#copy-inquiry-label').textContent=copyState==='copied'?text('คัดลอกแล้ว','Copied'):text('คัดลอกข้อความ','Copy message');
    $('#copy-inquiry-status').textContent=copyState==='copied'?text('คัดลอกข้อความแล้ว วางในแอปที่ต้องการได้เลย','Message copied. Paste it into your preferred app.'):copyState==='manual'?text('เลือกข้อความไว้แล้ว ใช้เมนูคัดลอกของอุปกรณ์ หรือกด Ctrl/Cmd + C','Message selected. Use your device’s Copy menu or press Ctrl/Cmd + C.'):'';
  };
  const syncMessage=()=>{
    const labels={name:text('ชื่อ','Name'),email:text('อีเมลติดต่อกลับ','Reply email'),category:text('หมวด','Collection'),item:text('ลักษณะงาน','Item'),gem:text('ชนิดพลอย','Gemstone'),shape:text('รูปทรง','Shape'),size:text('น้ำหนัก / ขนาด','Weight / size'),metal:text('วัสดุ','Metal'),budget:text('งบประมาณ','Budget'),date:text('วันที่ต้องการ','Required date'),details:text('รายละเอียด','Details')};
    const rows=[text('สวัสดี เพิ่มพร เครื่องประดับ ขอสอบถามข้อมูลดังนี้','Hello Permporn Accessories, I would like to enquire about:'),''];
    names.forEach(name=>{
      const el=$('#'+name);
      if(el.closest('.form-field').hidden||!el.value.trim())return;
      rows.push(labels[name]+': '+(el.tagName==='SELECT'?el.selectedOptions[0].textContent:el.value.trim()));
    });
    const content=rows.join('\n');
    if(message.value!==content){message.value=content;copyState='';renderCopy();}
    $('#send-email').href='mailto:contact@permporn-accessories.com?subject='+encodeURIComponent(text('สอบถามสินค้าและงานสั่งทำ — PERMPORN','Product and custom jewelry enquiry — PERMPORN'))+'&body='+encodeURIComponent(content);
    $('#share-whatsapp').href='https://wa.me/66836870818?text='+encodeURIComponent(content);
    document.querySelectorAll('.contact-option[href^="mailto:"]').forEach(a=>a.href=$('#send-email').href);
  };
  let state='',busy=false;
  const renderStatus=()=>{
    const status=$('#form-status');
    const messages={
      sending:images.length?text('กำลังส่งรายละเอียดและรูปภาพ…','Sending your enquiry and images…'):text('กำลังส่งรายละเอียด…','Sending your enquiry…'),
      sent:text('ส่งคำขอแล้ว ทีมงานจะติดต่อกลับทางอีเมลที่คุณระบุ','Your enquiry has been sent. Our team will reply to the email you provided.'),
      rate:text('ส่งคำขอบ่อยเกินไป กรุณารอสักครู่ หรือเลือกส่งผ่านแอปอื่น','Too many requests. Please wait a little or choose another app.'),
      invalid:text('กรุณาตรวจสอบอีเมลและรายละเอียด แล้วลองอีกครั้ง','Please check your email and details, then try again.'),
      images:text('รูปที่แนบส่งไม่ได้ กรุณาลบหรือเลือกรูป JPG, PNG หรือ WebP ใหม่ แล้วลองอีกครั้ง','The images could not be sent. Remove them or choose new JPG, PNG or WebP images, then try again.'),
      large:text('ไฟล์ที่ส่งมีขนาดใหญ่เกินไป กรุณาลดจำนวนรูปแล้วลองอีกครั้ง','The upload is too large. Remove an image and try again.'),
      error:text('ยังส่งคำขอไม่ได้ ข้อมูลที่กรอกยังอยู่ครบ ลองอีกครั้งหรือเลือกส่งผ่านแอปอื่น','We could not send your enquiry. Your details are still here. Try again or choose another app.')
    };
    status.textContent=messages[state]||'';
    status.dataset.state=state;
  };
  $('#category').addEventListener('change',()=>{
    if($('#category').value==='custom-jewelry'&&$('#item').value==='loose')$('#item').value='rings';
    visibility();syncMessage();
  });
  form.addEventListener('input',()=>{if(!busy){state='';renderStatus();}syncMessage();});
  form.addEventListener('change',()=>{visibility();syncMessage();});
  document.addEventListener('languagechange',()=>{syncMessage();renderStatus();renderCopy();renderImages();});
  shareToggle.addEventListener('click',()=>{
    const opening=sharePanel.hidden;
    sharePanel.hidden=!opening;
    shareToggle.setAttribute('aria-expanded',String(opening));
    if(opening){syncMessage();message.focus({preventScroll:true});sharePanel.scrollIntoView({block:'nearest'});}
  });
  sharePanel.addEventListener('keydown',e=>{
    if(e.key==='Escape'){sharePanel.hidden=true;shareToggle.setAttribute('aria-expanded','false');shareToggle.focus();}
  });
  copyButton.addEventListener('click',async()=>{
    if(copying)return;
    const content=message.value;
    copying=true;copyButton.disabled=true;
    try{
      if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(content);
      copyState=message.value===content?'copied':'';
    }catch(_){
      message.focus();message.select();message.setSelectionRange(0,message.value.length);
      copyState='manual';
    }finally{copying=false;copyButton.disabled=false;renderCopy();}
  });
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(busy||preparingImages||!form.reportValidity())return;
    const requestData=payload();
    busy=true;state='sending';renderStatus();
    renderImages();
    form.setAttribute('aria-busy','true');
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),60000);
    try{
      const response=await fetch(form.action,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(requestData),signal:controller.signal});
      const result=await response.json().catch(()=>({}));
      if(response.ok&&result.success===true)state='sent';
      else if(response.status===429)state='rate';
      else if(response.status===413)state='large';
      else if(result.code==='INVALID_IMAGES')state='images';
      else if(response.status===400)state='invalid';
      else state='error';
    }catch(_){state='error';}
    finally{
      clearTimeout(timeout);busy=false;
      renderImages();
      form.setAttribute('aria-busy','false');
      renderStatus();$('#form-status').focus({preventScroll:true});
    }
  });
  visibility();syncMessage();renderImages();form.hidden=false;
})();
