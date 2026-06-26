# Deploying to DreamHost & Setting Up Email

This guide covers (1) publishing the site to DreamHost and (2) creating the
`info@canineswhocare.org` email address.

---

## Part 1 — Deploy the website to DreamHost

The site is plain static files (HTML/CSS/JS/images) — **no build step**. You just
upload the files to your domain's web directory.

### What to upload

Everything in this project **except** the dev-only folders. Upload:

```
404.html  about-us.html  active-teams.html  contact.html  donate.html
index.html  memorial.html  retired-teams.html  team-members.html
.htaccess
css/   js/   fonts/   images/
```

Do **not** upload: `node_modules/`, `compare/`, `_scratch/`, `tests/`,
`test-results/`, `.git/`, `package.json`, `package-lock.json`,
`playwright.config.js`, `README.md`, `DEPLOY.md`. (These are listed in
`.gitignore` and aren't needed on the live server.)

> Note: `.htaccess` is a hidden file. Make sure your upload tool is set to
> **show/transfer hidden files** so it gets copied.

### Step A — Make sure the domain is hosted on DreamHost

1. Log in to the [DreamHost panel](https://panel.dreamhost.com).
2. Go to **Websites → Manage Websites** (or **Domains → Manage Domains**).
3. Confirm `canineswhocare.org` is listed and **"fully hosted"** (not "redirect"
   or "DNS only"). If it's not added yet: **Add Website**, enter the domain,
   choose **Fully host this domain**, and follow the prompts.
4. Note the **web directory** shown for the domain — it's usually
   `/home/<your-username>/canineswhocare.org/`. That folder is your web root.

### Step B — Upload the files (pick ONE method)

**Option 1 — SFTP (recommended, drag-and-drop)**

1. Get your SFTP credentials: DreamHost panel → **Websites → Manage Websites →**
   the domain → **Manage Files / FTP Users**, or **Servers → SFTP Users**. You'll
   need: server hostname, username, password, port `22`.
2. Use a free SFTP client:
   - **macOS:** [Cyberduck](https://cyberduck.io) or [FileZilla](https://filezilla-project.org)
3. Connect with **SFTP** (not plain FTP), the host, username, password, port 22.
4. On the server, open the web root from Step A
   (`/home/<username>/canineswhocare.org/`). If there's a default
   `index.html`/placeholder already there, delete it.
5. Drag the site files (the list above, **including `.htaccess`**) into that folder.
6. Wait for the transfer to finish (the `images/` folder is ~60 MB, so give it a minute).

**Option 2 — From this repo via Git/SSH (advanced)**

If you have SSH access, you can `git clone` the repo on the server and copy the
files into the web root. SFTP is simpler for a one-time deploy.

### Step C — Enable HTTPS (free SSL)

1. DreamHost panel → **Websites → Manage Websites →** the domain → **HTTPS/SSL**.
2. Add the free **Let's Encrypt** certificate. It takes a few minutes to issue.
3. Once it's active, open `.htaccess` and **uncomment** the three "Force HTTPS"
   lines (remove the leading `#`), then re-upload `.htaccess`. This makes
   `http://` redirect to `https://`.

### Step D — Verify

1. Visit `https://canineswhocare.org` — the home page should load.
2. Click through every nav page + the Team Members filter buttons
   (Active Teams / Retired Teams / Memorial).
3. Visit a fake URL like `https://canineswhocare.org/nope` — you should see the
   custom 404 page.
4. On the Donate page, click PayPal/Venmo/Zelle to confirm they open.
5. Submit the Contact form once to confirm Formspree delivers it (see the note in
   Part 2 about the first-submission confirmation).

### Updating the site later

Make changes locally, then re-upload only the files you changed via SFTP
(overwrite the old ones). Commit to GitHub too:
`git add -A && git commit -m "describe change" && git push`.

---

## Part 2 — Set up `info@canineswhocare.org` email on DreamHost

The website shows **info@canineswhocare.org** as the contact address (nav, footer,
"become a sponsor", mailto links). Here's how to create that mailbox.

> The **Zelle** address `canineswhocare@gmail.com` is a separate existing Gmail —
> leave it as-is. This section only sets up the `@canineswhocare.org` address.

### Step A — Create the mailbox

1. DreamHost panel → **Mail → Manage Email**.
2. Click **Create New Email Address**.
3. Enter `info` as the mailbox, and select `canineswhocare.org` as the domain →
   so the full address is `info@canineswhocare.org`.
4. Choose **Mailbox** (a real inbox you can log into). Set a strong password.
5. Set a mailbox size (the default is fine) and save. It can take a few minutes to
   provision.

> Alternative: if you'd rather have messages just **forward** to an existing inbox
> (e.g. the Gmail), choose **Forward-only address** instead of Mailbox and enter
> the destination. Simpler, but you can't *send* as info@ from a forward-only address.

### Step B — Read & send email (pick what you prefer)

**Webmail (no setup):** go to `https://webmail.canineswhocare.org` and log in with
the full address + password.

**In Gmail / Outlook / Apple Mail:** add the account using DreamHost's IMAP settings
(DreamHost panel → **Mail → Manage Email →** the address → shows these):

| Setting | Value |
|---|---|
| Incoming (IMAP) server | `imap.dreamhost.com` |
| Incoming port | `993` (SSL/TLS) |
| Outgoing (SMTP) server | `smtp.dreamhost.com` |
| Outgoing port | `465` (SSL) or `587` (STARTTLS) |
| Username | the full address `info@canineswhocare.org` |
| Password | the mailbox password |

### Step C — (Recommended) deliverability — SPF & DKIM

So your outgoing mail isn't flagged as spam:

1. DreamHost panel → **Mail → DKIM Signing** (or **Custom DKIM**) → enable DKIM
   for `canineswhocare.org`.
2. If DreamHost manages your DNS, SPF is usually added automatically. If your DNS
   is elsewhere, add an SPF record: `v=spf1 include:netblocks.dreamhost.com ~all`.

### Step D — Make sure forms still reach you

The Contact and "Start Your Journey" forms submit through **Formspree**
(`https://formspree.io/f/meebggjq`), not DreamHost email. Submissions land in
whatever inbox owns that Formspree form.

- **First-time activation:** the very first submission to a new Formspree form
  triggers a confirmation email to the form owner — click the link in it once to
  activate delivery.
- If you want form submissions to arrive at the new `info@canineswhocare.org`,
  set that as the recipient/notification email in your Formspree form settings.

---

## Quick checklist

- [ ] Domain fully hosted on DreamHost
- [ ] Site files (incl. `.htaccess`) uploaded to the web root
- [ ] HTTPS/SSL certificate added; HTTPS redirect enabled in `.htaccess`
- [ ] All pages, galleries, and the 404 page verified live
- [ ] `info@canineswhocare.org` mailbox created
- [ ] Webmail or mail-app access working
- [ ] DKIM enabled for deliverability
- [ ] Formspree form activated (first submission confirmed)
