// Progressive enhancement: native selects remain the source of form values.
(() => {
  'use strict';
  let closeCurrent=()=>{};
  document.querySelectorAll('select').forEach(select=>{
    const wrapper=document.createElement('div');wrapper.className='select-control';
    select.before(wrapper);wrapper.append(select);
    const trigger=document.createElement('button');trigger.type='button';trigger.className='select-trigger';
    trigger.id=select.id+'-trigger';trigger.setAttribute('role','combobox');trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');
    if(select.hasAttribute('aria-describedby'))trigger.setAttribute('aria-describedby',select.getAttribute('aria-describedby'));
    const value=document.createElement('span');value.id=select.id+'-value';trigger.append(value);
    const label=document.querySelector('label[for="'+select.id+'"]');
    if(label){label.id=label.id||select.id+'-label';trigger.setAttribute('aria-labelledby',label.id+' '+value.id);label.addEventListener('click',e=>{e.preventDefault();trigger.focus();});}
    else trigger.setAttribute('aria-label',select.getAttribute('aria-label')||select.id);
    const list=document.createElement('div');list.id=select.id+'-listbox';list.className='select-menu';list.setAttribute('role','listbox');list.hidden=true;
    trigger.setAttribute('aria-controls',list.id);wrapper.append(trigger,list);
    select.classList.add('select-native');select.tabIndex=-1;select.setAttribute('aria-hidden','true');
    let active=select.selectedIndex,typed='',typedAt=0,pointerSelecting=false;
    const options=()=>[...select.options];
    const close=()=>{list.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.removeAttribute('aria-activedescendant');};
    const highlight=(index,scroll=true)=>{active=index;[...list.children].forEach((el,i)=>el.classList.toggle('is-highlighted',i===active));if(list.children[active]){trigger.setAttribute('aria-activedescendant',list.children[active].id);if(scroll)list.children[active].scrollIntoView({block:'nearest'});}};
    const render=()=>{value.textContent=select.selectedOptions[0]?.textContent||'';trigger.disabled=select.disabled;list.replaceChildren();options().forEach((option,i)=>{const item=document.createElement('div');item.className='select-option';item.id=select.id+'-option-'+i;item.setAttribute('role','option');item.setAttribute('aria-selected',String(option.selected));item.setAttribute('aria-disabled',String(option.disabled));item.textContent=option.textContent;item.addEventListener('pointermove',()=>highlight(i,false));item.addEventListener('click',()=>choose(i));list.append(item);});};
    const choose=index=>{if(!options()[index]||options()[index].disabled)return;select.value=options()[index].value;select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));render();close();trigger.focus();};
    const open=()=>{closeCurrent();render();list.hidden=false;trigger.setAttribute('aria-expanded','true');closeCurrent=close;const available=window.innerHeight-trigger.getBoundingClientRect().bottom-16;list.classList.toggle('opens-up',available<160&&trigger.getBoundingClientRect().top>200);list.style.maxHeight=Math.max(100,Math.min(280,(list.classList.contains('opens-up')?trigger.getBoundingClientRect().top-16:available)))+'px';highlight(select.selectedIndex);};
    trigger.addEventListener('click',()=>list.hidden?open():close());
    trigger.addEventListener('keydown',e=>{
      if(e.key==='Tab'){close();return;}
      if(e.key==='Escape'){close();e.preventDefault();return;}
      if(['Enter',' '].includes(e.key)){e.preventDefault();if(list.hidden)open();else choose(active);return;}
      if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();if(list.hidden)open();let index=e.key==='Home'?0:e.key==='End'?options().length-1:Math.max(0,Math.min(options().length-1,active+(e.key==='ArrowDown'?1:-1)));while(options()[index]?.disabled&&index>0&&index<options().length-1)index+=e.key==='ArrowUp'?-1:1;highlight(index);return;}
      if(e.key.length===1&&!e.ctrlKey&&!e.metaKey){const now=Date.now();typed=now-typedAt>700?e.key:typed+e.key;typedAt=now;const index=options().findIndex(o=>!o.disabled&&o.textContent.toLocaleLowerCase().startsWith(typed.toLocaleLowerCase()));if(index>=0){if(list.hidden)open();highlight(index);}}
    });
    // An option click can blur the trigger before click fires. Keep the list
    // available through that pointer gesture, including touch scrolling.
    list.addEventListener('pointerdown',e=>{pointerSelecting=true;if(e.pointerType==='mouse')e.preventDefault();});
    document.addEventListener('pointerup',()=>{pointerSelecting=false;});
    document.addEventListener('pointercancel',()=>{pointerSelecting=false;});
    wrapper.addEventListener('focusout',e=>{if(!pointerSelecting&&!wrapper.contains(e.relatedTarget))close();});
    document.addEventListener('pointerdown',e=>{if(!wrapper.contains(e.target))close();});
    document.addEventListener('languagechange',()=>{render();close();});
    select.addEventListener('change',render);select.form?.addEventListener('reset',()=>setTimeout(render,0));
    render();
  });
})();
