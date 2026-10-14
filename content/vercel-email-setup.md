# Vercel + Google email setup

The form posts its complete enquiry to `/api/inquiry`. The private Vercel function sends it through Google SMTP to **contact@permporn-accessories.com**, with the visitor's email as Reply-To. Neither Google credentials nor server source are copied into the public `dist/` directory. No FormSubmit account is used.

## Deployment

Import this repository into Vercel (Framework Preset: Other), or use the prepared `output/permporn-vercel.zip` source bundle. The included `vercel.json` builds the static pages into `dist/` and deploys `api/inquiry.js` as a Node function. Build command: `npm run build`; Output Directory: `dist`. The separate `permporn-website.zip` contains static files only and does not include the backend.

Before deploying, set these in **Vercel → Project → Settings → Environment Variables**, using the actual Google mailbox that will send the messages:

| Variable | Value |
| --- | --- |
| `GOOGLE_MAIL_USER` | Google mailbox address, usually `contact@permporn-accessories.com` if it is a sign-in account rather than an alias |
| `GOOGLE_APP_PASSWORD` | That account's Google App Password; do not use the ordinary account password |
| `CONTACT_ALLOWED_ORIGINS` | Optional comma-separated custom website origins, for example `https://permporn-accessories.com,https://www.permporn-accessories.com` |

Keep secrets in Vercel, not frontend files or chat. Redeploy after setting or changing environment variables. Google App Passwords require 2-Step Verification and may be unavailable under some Workspace account policies. The account owner must create any credential themselves. [Google instructions](https://support.google.com/accounts/answer/185833).

If App Passwords are unavailable and an existing Google OAuth integration is used, configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN` instead, along with `GOOGLE_MAIL_USER`. This implementation supports Nodemailer's Gmail OAuth refresh flow. [Nodemailer OAuth documentation](https://nodemailer.com/smtp/oauth2).

## Local preview and checks

```text
npm install
npm run build
npm test
node --env-file=.env server/local.cjs
```

Create `.env` from `.env.example` privately if testing real Google delivery locally. It is ignored by Git. The regular Node preview runs at `http://127.0.0.1:3000`. VS Code Live Server only serves static files and does not run `/api/inquiry`; use the Node preview or Vercel for form submissions.

For UI tests that must not send an email:

```text
node server/local.cjs --mock-mail
```

This runs at `http://127.0.0.1:4174` and substitutes a local mock transport. No real mailbox is contacted. Including `MOCK_FAIL` in the enquiry details simulates an SMTP failure for testing the error recovery flow.

## Behavior and verification limits

- Success is displayed only after SMTP accepts the recipient. An unavailable configuration or rejected send returns an error, preserves the visitor's fields, and offers an email-app button with the entire enquiry already filled in.
- The recipient and sender are controlled by server code/configuration; the visitor cannot use the endpoint as an arbitrary mail relay. Enquiry types and field sizes are validated, origins are restricted, duplicate submissions are coalesced, and a honeypot and warm-instance rate limit reduce abuse. The in-memory limits do not constitute a global distributed rate limit; configure Vercel's endpoint protections if stronger controls are required.
- No customer content, authentication secrets, or raw SMTP errors are logged by the endpoint. No enquiry database is created. Google mailbox retention is managed by the mailbox owner.
- Unit and browser tests use synthetic details and mock mail delivery. Real Google delivery and a live Vercel deployment still require the owner's configuration and verification.

[Vercel Node function documentation](https://vercel.com/docs/functions/runtimes/node-js) · [Nodemailer SMTP documentation](https://nodemailer.com/smtp).
