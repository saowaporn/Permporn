"""Check production HTML, local references, anchors, and disclosure labels."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys
import re

root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
errors = []

class Page(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.file = file
        self.ids = set()
        self.refs = []
        self.h1 = 0
        self.option_depth = 0
        self.description = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if self.option_depth and tag != 'option':
            errors.append(f'{self.file.name}: element <{tag}> inside native option')
        if tag == 'option': self.option_depth += 1
        if tag == 'h1': self.h1 += 1
        if a.get('id'):
            if a['id'] in self.ids: errors.append(f'{self.file.name}: duplicate id {a["id"]}')
            self.ids.add(a['id'])
        if tag == 'meta' and a.get('name') == 'description' and a.get('content'): self.description = True
        for key in ['href', 'src']:
            if a.get(key): self.refs.append(a[key])
        if tag == 'img' and 'alt' not in a: errors.append(f'{self.file.name}: missing image alt')
        if a.get('target') == '_blank' and 'noopener' not in a.get('rel', ''):
            errors.append(f'{self.file.name}: external link lacks noopener')
    def handle_endtag(self, tag):
        if tag == 'option': self.option_depth -= 1

pages = {}
for file in root.glob('*.html'):
    page = Page(file)
    html = file.read_text(encoding='utf-8-sig')
    page.feed(html)
    if page.h1 != 1: errors.append(f'{file.name}: expected one h1, found {page.h1}')
    if not page.description: errors.append(f'{file.name}: missing description')
    if 'data-title-th=' not in html or 'data-title-en=' not in html: errors.append(f'{file.name}: missing bilingual metadata')
    if 'Supplier partnership' in html or 'Add project image' in html: errors.append(f'{file.name}: obsolete copy')
    pages[file.resolve()] = page

links = 0
for file, page in pages.items():
    for ref in page.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc: continue
        target = (file.parent / unquote(url.path)).resolve() if url.path else file
        if not target.is_file(): errors.append(f'{file.name}: broken file reference {ref}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'{file.name}: broken anchor {ref}')
        links += 1

if len(pages) != 11: errors.append(f'Expected 11 HTML pages; found {len(pages)}')
for file in pages:
    html = file.read_text(encoding='utf-8')
    if re.search(r'\bAI\b|class="(?:photo-label|hero-image-note|image-note)"', html):
        errors.append(f'{file.name}: obsolete image label')
if 'assets/images/hero-realistic-v2.jpg' not in (root/'index.html').read_text(encoding='utf-8'):
    errors.append('index.html: expected updated cover image')
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'PASS: {len(pages)} pages, {links} local references and anchors, metadata, updated cover, clean image labels, and HTML option structure.')
