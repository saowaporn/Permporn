const {test}=require('node:test');
const assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const {formatThaiHtml,headingPhrases}=require('../scripts/thai-typography.cjs');

test('Thai compounds and reviewed heading phrases keep the exact original text',()=>{
  for(const [text,phrases] of headingPhrases){
    assert.equal(phrases.join(''),text);
    const html=formatThaiHtml(`<h1><span class="lang-th" lang="th">${text}</span></h1>`);
    const dom=new JSDOM(html);
    try{
      assert.equal(dom.window.document.querySelector('h1').textContent,text);
      assert.equal(dom.window.document.querySelectorAll('.thai-phrase').length,phrases.filter(p=>p.trim()).length);
    }finally{dom.window.close();}
  }
  const text='คัดสรรเครื่องประดับตามความต้องการ พร้อมให้ข้อมูลก่อนตัดสินใจ';
  const dom=new JSDOM(formatThaiHtml(`<p>${text}</p>`));
  try{
    assert.equal(dom.window.document.querySelector('p').textContent,text);
    for(const word of ['คัดสรร','เครื่องประดับ','ความต้องการ','ก่อนตัดสินใจ'])assert.ok([...dom.window.document.querySelectorAll('.thai-word')].some(el=>el.textContent===word));
  }finally{dom.window.close();}
});

test('native options, metadata, scripts, editable values and English remain unchanged',()=>{
  const untouched='<title>เครื่องประดับ</title><meta name="description" content="เครื่องประดับ"><script>const name="เพิ่มพร";</script><textarea>รูปอ้างอิง</textarea><select><option data-text-th="เพชรธรรมชาติ">เพชรธรรมชาติ</option></select><input value="งบประมาณ"><p lang="en">Choose a diamond and compare the details.</p>';
  assert.equal(formatThaiHtml(untouched),untouched);
  const address='contact@permporn-accessories.com';
  const dom=new JSDOM(formatThaiHtml(`<p>ติดต่อกลับ ${address}</p>`));
  try{
    const link=dom.window.document.querySelector('.text-address');
    assert.equal(link.textContent,address);assert.equal(link.lang,'en');
    assert.equal(dom.window.document.querySelector('p').textContent,'ติดต่อกลับ '+address);
  }finally{dom.window.close();}
});

test('repetition marks and numeric units stay with the preceding word or number',()=>{
  const original='เริ่มต้นง่าย ๆ เลือกรูปอื่น ๆ ได้สูงสุด 3 รูป รวม 2 MB';
  const dom=new JSDOM(formatThaiHtml(`<p>${original}</p>`));
  try{
    assert.equal(dom.window.document.querySelector('p').textContent,original);
    const groups=[...dom.window.document.querySelectorAll('.thai-word')].map(el=>el.textContent);
    for(const text of ['ง่าย ๆ','อื่น ๆ','3 รูป','2 MB'])assert.ok(groups.includes(text),text);
  }finally{dom.window.close();}
});
