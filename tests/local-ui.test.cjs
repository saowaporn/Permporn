const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
function page(name,query='',dialogs=false){
  const dom=new JSDOM(fs.readFileSync(path.join(root,name+'.html'),'utf8'),{url:'http://localhost:4174/'+name+'.html'+query,runScripts:'outside-only'});
  const w=dom.window;
  // jsdom has no native modal implementation; model only its open/close lifecycle.
  if(dialogs){
    w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
    w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
  }
  w.matchMedia=()=>({matches:false,addEventListener(){}});
  w.HTMLElement.prototype.scrollIntoView=function(){};
  w.fetch=()=>{throw new Error('UI tests must not send requests');};
  w.eval(fs.readFileSync(path.join(root,'assets/site.js'),'utf8'));
  if(name==='contact')w.eval(fs.readFileSync(path.join(root,'assets/inquiry-form.js'),'utf8'));
  return dom;
}

test('enquiry information opens without consent, preserves the form, and accepts explicitly',()=>{
  const dom=page('contact','',true),w=dom.window,d=w.document;
  try{
    const trigger=d.querySelector('#privacy-trigger'),dialog=d.querySelector('#privacy-dialog'),consent=d.querySelector('#consent');
    const details=d.querySelector('#details');details.value='Keep this enquiry while reading';
    const originalHash=w.location.hash;
    trigger.focus();trigger.click();
    assert.equal(dialog.open,true);
    assert.equal(w.location.hash,originalHash);
    assert.equal(consent.checked,false);
    assert.equal(d.querySelector('#privacy-dialog-body').textContent,d.querySelector('#privacy .narrow').textContent.replace(d.querySelector('#privacy h2').textContent,''));
    dialog.querySelector('[data-privacy-close]').click();
    assert.equal(dialog.open,false);
    assert.equal(consent.checked,false);
    assert.equal(d.activeElement,trigger);
    assert.equal(details.value,'Keep this enquiry while reading');
    trigger.click();
    const privacyConsent=d.querySelector('#privacy-consent');
    assert.equal(privacyConsent.checked,false);
    privacyConsent.click();
    assert.equal(dialog.open,false);
    assert.equal(consent.checked,true);
    assert.equal(d.activeElement,consent);
    assert.equal(details.value,'Keep this enquiry while reading');
    trigger.click();assert.equal(privacyConsent.checked,true);
    privacyConsent.click();assert.equal(consent.checked,false);
    assert.equal(dialog.open,true);
    dialog.querySelector('label[for="privacy-consent"]').click();assert.equal(consent.checked,true);
    assert.equal(dialog.open,false);
    assert.equal(consent.checked,true);
    assert.equal(d.activeElement,consent);
    assert.equal(d.documentElement.classList.contains('privacy-dialog-open'),false);
    assert.equal(new w.FormData(d.querySelector('form')).get('consent'),'on');
    consent.click();assert.equal(consent.checked,false);assert.equal(privacyConsent.checked,false);
    trigger.click();dialog.querySelector('.privacy-dialog-close').click();
    consent.click();assert.equal(consent.checked,true);assert.equal(privacyConsent.checked,true);
    trigger.click();assert.equal(privacyConsent.checked,true);dialog.close();assert.equal(consent.checked,true);
  }finally{w.close();}
});

test('enquiry information supports English, backdrop dismissal, and a plain-link fallback',()=>{
  const dom=page('contact','',true),w=dom.window,d=w.document;
  try{
    d.querySelector('[data-language=en]').click();
    const dialog=d.querySelector('#privacy-dialog');d.querySelector('#privacy-trigger').click();
    assert.equal(dialog.querySelector('[data-privacy-close]').getAttribute('aria-label'),'Close enquiry information');
    assert.match(d.querySelector('#privacy-dialog-body .lang-en').textContent,/Your name, email/);
    dialog.getBoundingClientRect=()=>({left:20,top:20,right:600,bottom:700});
    dialog.dispatchEvent(new w.MouseEvent('click',{bubbles:true,clientX:30,clientY:30}));
    assert.equal(dialog.open,true);
    dialog.dispatchEvent(new w.MouseEvent('click',{bubbles:true,clientX:5,clientY:5}));
    assert.equal(dialog.open,false);
    assert.equal(d.querySelector('#consent').checked,false);
  }finally{w.close();}
  const fallback=page('contact');
  try{
    const d=fallback.window.document;
    assert.equal(d.querySelector('#privacy-trigger').getAttribute('href'),'#privacy');
    assert.equal(d.querySelector('#privacy-trigger').hasAttribute('aria-haspopup'),false);
    assert.equal(d.querySelector('#privacy').hidden,false);
    assert.equal(d.querySelector('#inquiry-form').hidden,false);
  }finally{fallback.window.close();}
});
test('native collection select updates visible fields and shareable message',()=>{
  const dom=page('contact'),w=dom.window,d=w.document;
  try{
    d.querySelector('#category').value='colored-gemstones';
    d.querySelector('#category').dispatchEvent(new w.Event('change',{bubbles:true}));
    assert.equal(d.querySelector('#gem').closest('.form-field').hidden,false);
    d.querySelector('#toggle-inquiry-share').click();
    assert.match(d.querySelector('#inquiry-message').value,/พลอยสี/);
    assert.equal(new w.FormData(d.querySelector('form')).get('category'),'colored-gemstones');
  }finally{w.close();}
});
test('shape links prefill native fields and changing language preserves carat selection',()=>{
  const dom=page('contact','?category=lab-grown-diamonds&shape=Oval#inquiry'),w=dom.window,d=w.document;
  try{
    assert.equal(d.querySelector('#category').value,'lab-grown-diamonds');
    assert.equal(d.querySelector('#shape').value,'Oval');
    const size=d.querySelector('#size');size.value='0.30 ct';
    size.dispatchEvent(new w.Event('change',{bubbles:true}));
    assert.equal(new w.FormData(d.querySelector('form')).get('size'),'0.30 ct');
    d.querySelector('#toggle-inquiry-share').click();
    assert.match(d.querySelector('#inquiry-message').value,/0.30 ct/);
    d.querySelector('[data-language=en]').click();
    assert.match(size.options[0].textContent,/Not sure/);
    assert.equal(size.value,'0.30 ct');
  }finally{w.close();}
});

test('budget groups thousands while preserving decimals, editing, and shared form values',()=>{
  const dom=page('contact'),w=dom.window,d=w.document;
  try{
    const budget=d.querySelector('#budget');
    const input=(value,caret=value.length)=>{budget.value=value;budget.setSelectionRange(caret,caret);budget.dispatchEvent(new w.Event('input',{bubbles:true}));};
    input('100000');assert.equal(budget.value,'100,000');
    input('1234567.50');assert.equal(budget.value,'1,234,567.50');
    input('12,934,567.50',4);assert.equal(budget.selectionStart,4);
    input('1,2000',4);assert.equal(budget.value,'12,000');assert.equal(budget.selectionStart,4);
    assert.equal(new w.FormData(d.querySelector('form')).get('budget'),'12,000');
    d.querySelector('#toggle-inquiry-share').click();assert.match(d.querySelector('#inquiry-message').value,/12,000/);
    input('');assert.equal(budget.value,'');
    input('0');assert.equal(budget.value,'0');
  }finally{w.close();}
});

test('FAQ categories, search, empty result, reset, and language remain usable',()=>{
  const dom=page('faq'),w=dom.window,d=w.document;
  try{
    d.querySelector('[data-faq-filter=payment]').click();
    const visible=()=>[...d.querySelectorAll('.faq-item')].filter(el=>!el.hidden);
    assert.ok(visible().length>0);
    assert.ok(visible().every(el=>el.dataset.group==='payment'));
    const search=d.querySelector('#faq-search');
    search.value='no-matching-question-123';search.dispatchEvent(new w.Event('input',{bubbles:true}));
    assert.equal(visible().length,0);assert.equal(d.querySelector('#faq-empty').hidden,false);
    d.querySelector('#reset-faq').click();
    assert.equal(search.value,'');assert.equal(d.querySelector('#faq-empty').hidden,true);
    assert.equal(visible().length,d.querySelectorAll('.faq-item').length);
    d.querySelector('[data-language=en]').click();assert.match(d.querySelector('#faq-count').textContent,/questions/);
  }finally{w.close();}
});

test('all select options stay editable and focusable without a custom popup',()=>{
  const dom=page('contact'),w=dom.window,d=w.document;
  try{
    const category=d.querySelector('#category');category.value='custom-jewelry';
    category.dispatchEvent(new w.Event('change',{bubbles:true}));
    for(const select of d.querySelectorAll('select')){
      assert.equal(select.disabled,false);assert.equal(select.tabIndex,0);
      assert.equal(select.getAttribute('aria-hidden'),null);
      assert.ok(d.querySelector('label[for="'+select.id+'"]'));
      for(const option of select.options){
        select.value=option.value;select.dispatchEvent(new w.Event('change',{bubbles:true}));
        assert.equal(select.value,option.value);
        assert.equal(new w.FormData(d.querySelector('form')).get(select.name),option.value);
      }
    }
    for(const field of d.querySelectorAll('#name,#email,#budget,#date,#details')){
      assert.equal(field.disabled,false);assert.equal(field.readOnly,false);
    }
    assert.equal(d.querySelector('.select-trigger,.select-native'),null);
  }finally{w.close();}
});

test('edited enquiry fields reach the email endpoint together',async()=>{
  const dom=page('contact'),w=dom.window,d=w.document;
  try{
    const expected={name:'Form test',email:'visitor@example.com',category:'custom-jewelry',item:'rings',gem:'spinel',shape:'Pear',size:'1.50 ct',metal:'18K',budget:'150,000',date:'2026-12-15',details:'Please advise on this design.'};
    for(const [id,value] of Object.entries(expected)){
      const field=d.getElementById(id);field.value=value;
      field.dispatchEvent(new w.Event(field.tagName==='SELECT'?'change':'input',{bubbles:true}));
    }
    d.querySelector('#consent').checked=true;
    let sent;
    w.fetch=async(url,options)=>{assert.match(url,/\/api\/inquiry$/);sent=JSON.parse(options.body);return {ok:true,json:async()=>({success:true})};};
    const form=d.querySelector('form');form.reportValidity=()=>true;
    form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
    await new Promise(resolve=>setTimeout(resolve,0));
    for(const [key,value] of Object.entries(expected))assert.equal(sent[key],value);
    assert.equal(sent.consent,true);
    assert.equal(d.querySelector('#form-status').dataset.state,'sent');
  }finally{w.close();}
});

test('single-language diamond labels, gold line drawings, compact homepage, and all page initialization',()=>{
  const files=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
  assert.equal(files.length,11);
  for(const file of files){
    const dom=page(file.slice(0,-5)),w=dom.window,d=w.document;
    try{
      assert.equal(d.querySelectorAll('.category-hero>.status,.category-hero>div>.status').length,0);
      assert.equal(d.querySelectorAll('.service-ribbon').length,0);
      assert.equal(d.querySelectorAll('.topline-message:not(.topline-clone)').length,4);
      assert.equal(d.querySelectorAll('.select-trigger,.select-native').length,0);
      assert.ok(!/\?{4}/.test(d.body.textContent),file+' must preserve Thai text');
      if(file.includes('diamonds')){
        const shapes=d.querySelectorAll('.shape-option');assert.equal(shapes.length,9);
        shapes.forEach(el=>{assert.ok(el.querySelector('svg.diamond-shape'));assert.equal(el.querySelector('img'),null);assert.equal(el.querySelector('small'),null);});
        assert.equal(d.querySelector('#carat'),null);
        assert.equal(d.querySelector('.preference-bar'),null);
        shapes.forEach(el=>{
          const url=new URL(el.href);
          assert.equal(url.pathname,'/contact.html');
          assert.equal(url.searchParams.get('shape'),el.dataset.shape);
          assert.equal(url.searchParams.get('category'),file.slice(0,-5));
          assert.equal(url.hash,'#inquiry');
          const click=new w.MouseEvent('click',{bubbles:true,cancelable:true});
          el.addEventListener('click',event=>{assert.equal(event.defaultPrevented,false);event.preventDefault();},{once:true});
          el.dispatchEvent(click);
          assert.equal(el.getAttribute('role'),null);
        });
        assert.equal(shapes[0].querySelector('strong .lang-th').textContent,'กลม');
      }
      if(file==='index.html')assert.match(d.querySelector('.story-selection img').src,/story-selection-v1/);
    }finally{w.close();}
  }
});
