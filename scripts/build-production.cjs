const {execFileSync} = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
for (const file of ['build-site.cjs','package-site.cjs']) {
  execFileSync(process.execPath,[path.join(__dirname,file)],{cwd:root,stdio:'inherit'});
}
