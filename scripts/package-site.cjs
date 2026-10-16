// Package only public files; keep source documents and internal review notes private.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
fs.mkdirSync(path.join(out, 'assets', 'images'), {recursive:true});
for (const name of fs.readdirSync(root).filter(n => n.endsWith('.html'))) fs.copyFileSync(path.join(root,name),path.join(out,name));
for (const name of ['sitemap.xml','robots.txt']) fs.copyFileSync(path.join(root,name),path.join(out,name));
for (const name of ['styles.css','site.js','inquiry-form.js','select-controls.js','permporn-logo-mark.png','hero-jewelry.png']) fs.copyFileSync(path.join(root,'assets',name),path.join(out,'assets',name));
for (const name of fs.readdirSync(path.join(root,'assets','images')).filter(n => n.endsWith('-concept.jpg')||['hero-realistic-v2.jpg','story-selection-v1.png'].includes(n))) fs.copyFileSync(path.join(root,'assets','images',name),path.join(out,'assets','images',name));
console.log('Public hosting files packaged in dist/. Internal source documents are excluded.');
