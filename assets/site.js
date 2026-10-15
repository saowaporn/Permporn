(() => {
  'use strict';
  const root = document.documentElement;
  const lang = () => root.dataset.language || 'th';
  const text = (th, en) => lang() === 'th' ? th : en;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  function applyLanguage(language) {
    root.lang = language; root.dataset.language = language;
    const key = language === 'th' ? 'Th' : 'En';
    document.title = document.body.dataset['title'+key];
    const description = document.body.dataset['description'+key];
    $('meta[name="description"]').content = description;
    $('meta[property="og:title"]').content = document.title;
    $('meta[property="og:description"]').content = description;
    $$('button[data-language]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.language === language)));
    $$('[data-text-th]').forEach(el => { el.textContent = el.dataset['text'+key]; });
    $$('[data-alt-th]').forEach(el => { el.alt = el.dataset['alt'+key]; });
    $$('[data-placeholder-th]').forEach(el => { el.placeholder = el.dataset['placeholder'+key]; });
    $$('[data-label-th]').forEach(el => { el.setAttribute('aria-label',el.dataset['label'+key]); });
    document.dispatchEvent(new CustomEvent('languagechange'));
  }
  $$('button[data-language]').forEach(b => b.addEventListener('click', () => {
    try { localStorage.setItem('permporn-language', b.dataset.language); } catch (_) {}
    applyLanguage(b.dataset.language);
  }));
  const menu = $('.menu-button'); const nav = $('#main-nav');
  function closeMenu() {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded','false');
    $$('.nav-dropdown[open]').forEach(d => d.open=false);
  }
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menu.setAttribute('aria-expanded',String(open));
    if (!open) closeMenu();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const openDropdown = $('.nav-dropdown[open]');
    if (nav.classList.contains('is-open')) menu.focus();
    else if (openDropdown && openDropdown.contains(document.activeElement)) openDropdown.querySelector('summary').focus();
    closeMenu();
  });
  $$('.nav-dropdown').forEach(d => d.addEventListener('focusout', e => {
    if (e.relatedTarget && !d.contains(e.relatedTarget)) d.open=false;
  }));
  document.addEventListener('click', e => {
    if (!e.target.closest('.site-header')) closeMenu();
    $$('.nav-dropdown[open]').forEach(d => {if (!d.contains(e.target)) d.open=false;});
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click',()=>{
    // Let the link navigate before collapsing the dropdown that contains it.
    setTimeout(closeMenu,0);
  }));
  window.matchMedia('(min-width:1181px)').addEventListener('change', closeMenu);
  const contactToggle = $('#contact-toggle');
  const contactOptions = $('#contact-options');
  if (contactToggle && contactOptions) {
    contactToggle.setAttribute('role','button');
    const closeContact = (restoreFocus=false) => {
      contactOptions.hidden=true;
      contactToggle.setAttribute('aria-expanded','false');
      if(restoreFocus)contactToggle.focus();
    };
    contactToggle.addEventListener('click',e => {
      e.preventDefault();
      const open=contactOptions.hidden;
      contactOptions.hidden=!open;
      contactToggle.setAttribute('aria-expanded',String(open));
      if(open)contactOptions.querySelector('.contact-option').focus();
    });
    contactToggle.addEventListener('keydown',e => {
      if(e.key===' '){e.preventDefault();contactToggle.click();}
    });
    $('.contact-options-close').addEventListener('click',()=>closeContact(true));
    document.addEventListener('keydown',e => {
      if(e.key==='Escape'&&!contactOptions.hidden)closeContact(true);
    });
    document.addEventListener('click',e => {
      if(!e.target.closest('.contact-widget'))closeContact();
    });
    document.addEventListener('focusin',e => {
      if(!contactOptions.hidden&&!e.target.closest('.contact-widget'))closeContact();
    });
    contactOptions.querySelectorAll('.contact-option').forEach(a=>a.addEventListener('click',()=>setTimeout(()=>closeContact(),0)));
  }
  $('#year').textContent = new Date().getFullYear();
  const shapeLinks = $$('[data-shape]');
  if (shapeLinks.length) {
    let shape = ''; const carat = $('#carat');
    const update = () => {
      const parts = [shape, carat.value].filter(Boolean);
      $('#preference-summary').textContent = parts.length ? text('ความต้องการ: ','Preferences: ')+parts.join(' / ') : text('เลือกทรงและน้ำหนัก หรือให้เราช่วยแนะนำได้','Choose a shape and weight, or ask us for guidance.');
      const query = new URLSearchParams({category:$('#shape-inquiry').dataset.category});
      if(shape)query.set('shape',shape); if(carat.value)query.set('size',carat.value);
      $('#shape-inquiry').href='contact.html?'+query+'#inquiry';
    };
    shapeLinks.forEach(a => {a.setAttribute('role','button');a.addEventListener('click',e => {e.preventDefault();shape=shape===a.dataset.shape?'':a.dataset.shape;shapeLinks.forEach(l=>l.setAttribute('aria-pressed',String(l.dataset.shape===shape)));update();});a.addEventListener('keydown',e=>{if(e.key===' '){e.preventDefault();a.click();}});});
    carat.addEventListener('change', update); document.addEventListener('languagechange',update);
  }
  const tabs = $$('[data-tab]');
  if(tabs.length) {
    function selectTab(tab, focus=false) {
      tabs.forEach(t => {const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;$('#panel-'+t.dataset.tab).hidden=!active;});
      if(focus)tab.focus();
    }
    tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%tabs.length;if(e.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();selectTab(tabs[next],true);}});});
  }
  const search = $('#faq-search');
  if(search) {
    let category = 'all'; const items = $$('.faq-page .faq-item');
    function filter() {
      const query = search.value.trim().toLocaleLowerCase(); let count=0;
      items.forEach(item=>{const matches=(category==='all'||item.dataset.group===category)&&item.textContent.toLocaleLowerCase().includes(query);item.hidden=!matches;if(matches)count++;});
      $('#faq-empty').hidden=count!==0;
      $('#faq-count').textContent=text(`พบ ${count} คำถาม`,`${count} question${count===1?'':'s'} found`);
    }
    $$('[data-faq-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.faqFilter;$$('[data-faq-filter]').forEach(f=>f.setAttribute('aria-pressed',String(f===b)));filter();}));
    search.addEventListener('input',filter);
    $('#reset-faq').addEventListener('click',()=>{search.value='';category='all';$$('[data-faq-filter]').forEach(f=>f.setAttribute('aria-pressed',String(f.dataset.faqFilter==='all')));filter();search.focus();});
    document.addEventListener('languagechange',filter);
  }
  applyLanguage(lang());
})();
