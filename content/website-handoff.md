# Website update — 14 October 2026

The website uses the Thai and English content in `source-documents/01.md`–`10.md`. Public HTML is pre-rendered. The direct email form now uses a private Node.js function on Vercel and Nodemailer; no frontend framework or enquiry database is required.

| Source | Public destination | Included content |
| --- | --- | --- |
| 01 | index.html, shared navigation and footer | Brand, hero, four collections, contact channels |
| 02 | natural-diamonds.html | Sourcing, nine shapes, 4Cs, measurements, reports, custom setting coordination |
| 03 | lab-grown-diamonds.html | Lab-grown disclosure, nine shapes, preferred weights, CVD/HPHT verification |
| 04 | colored-gemstones.html | Jade, ruby, sapphire, emerald, other gems; treatments and verified origin |
| 05 | custom-jewelry.html | Rings, earrings, pendants, necklaces, works enquiry, materials, CAD and five custom steps |
| 06 | about.html | Introduction, approach, four values, transparency, client groups |
| 07 | services.html | Sourcing diamonds and gems, comparison, design and production coordination |
| 08 | how-to-order.html | Five steps, helpful brief, written confirmations for each order |
| 09 | contact.html | LINE, WhatsApp, Facebook, phone, email, appointments, Google Maps, direct email inquiry form |
| 10 | faq.html, how-to-order.html, contact.html#privacy | Ten expandable searchable FAQs, order discussion checklist, explanation of enquiry data processing |

`collections.html` is an additional browsing page linking all four collections. Thai is the default language. Language preference is saved in browser storage and retained between pages.

The centered top strip rotates every four seconds between the brand tagline, phone number, and “Diamonds, gemstones & custom jewelry” in the selected language. The phone remains a tappable call link when shown. A pause/play control is available; hover and keyboard focus pause the strip, and reduced-motion preference starts it paused.

## Editing and hosting

- Edit bilingual content in `site-content.cjs`, and page structure in `../scripts/build-site.cjs`. Run `node scripts/build-site.cjs` to regenerate the HTML pages.
- Check files using `python scripts/check-site.py` and JavaScript syntax using `node --check assets/site.js`.
- On Vercel, deploy the project root using `vercel.json`; static public files come from `dist/` and the server-only mail endpoint comes from `api/inquiry.js`. Deploying `dist/` alone will not run the mail endpoint. Use `node scripts/package-vercel.cjs` for an explicit source allowlist that excludes private documents and credentials.
- The sitemap uses the website domain supplied in source 01: `https://permporn-accessories.com`. Change `siteUrl` in the generator if production uses a different domain. Robots exclusions are supplementary; internal files are excluded from the hosting package itself.
- For static preview, use VS Code Live Server. For the email endpoint, use `npm run build` and `npm start`, with private Google variables configured. See `vercel-email-setup.md`.

## Image assets

Five original concept illustrations are stored in `../assets/images/`. The prompt set and generation record are in `image-generation.md`. Images were optimized to JPEG for page performance. The existing brand logo is retained.

The owner first requested restoration of `../assets/hero-jewelry.png`, then requested a more photographic version. The current homepage and social-sharing cover is `../assets/images/hero-realistic-v2.jpg`. Visible image badges and AI wording were removed at the owner's request. The images are concept imagery rather than verified inventory or completed work; other collection illustrations remain in use. See `cover-realism-update.md` for the final edit prompt and asset path.

## Data requiring business confirmation

The sources do not supply approved item-level inventory, prices, report numbers, authorized finished-project photography, current Instagram handle, registered details, final deposit/warranty/refund terms, or a complete business privacy policy. These have not been invented. The owner subsequently supplied the Google Maps location, so the appointment address is now displayed; registered legal details remain internal and are not inferred from that address. Draft policies in source 10 are not published as binding terms. The FAQ explains what must be agreed for each order.

The current inquiry form posts complete details to a private Vercel endpoint, which sends to the business email using Google SMTP. It does not confirm an appointment or create a customer database. The optional email-app link automatically inserts all entered details, without a copy/paste step. Configure private Google credentials using `vercel-email-setup.md` before live use; real delivery has not yet been verified. The owner supplied the Google Maps link, so the appointment address and an embedded map are now shown. The floating contact picker offers LINE, WhatsApp, Facebook, and email on every page. No real test messages have been sent.

## Design

Palette: black #000000, gold #C9A961, white #FFFFFF, text #191919, muted text #616161, soft surface #F6F6F4. Pridi display type and DM Sans Latin body type, with Tahoma Thai body fallback. Hero jewelry imagery is balanced by white reading sections, clear navigation, familiar category names, visible focus, reduced-motion support, and responsive layouts.
