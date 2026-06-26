# Fix: domain still shows the old Wix site

**Diagnosis (confirmed):** Your nameservers are already at DreamHost
(`ns1/ns2/ns3.dreamhost.com`), but the domain's **A records still point to Wix**:

```
canineswhocare.org  →  185.230.63.107 / .171 / .186   ← these are WIX IPs
```

The HTTP response confirms it (`server: Pepyaka`, `x-wix-cache-control` = Wix).
Nothing is wrong with your DreamHost site — the domain just isn't aimed at it yet.

Your files are already uploaded to DreamHost, so it's safe to repoint now.

---

## The fix — remove the Wix records, point to DreamHost

All of this happens in the **DreamHost panel** (you control DNS there).

### Step 1 — Get your DreamHost site IP
1. [DreamHost panel](https://panel.dreamhost.com) → **Websites → Manage Websites**.
2. Click the `canineswhocare.org` site → note the **IP address** shown
   (e.g. `64.90.x.x`, `173.236.x.x`, `208.97.x.x`, or `69.163.x.x`).
   Keep this handy for Step 3.

### Step 2 — Delete the Wix DNS records
1. DreamHost panel → **Domains → Manage Domains**.
2. Find `canineswhocare.org` → click **DNS**.
3. In the **"Custom DNS Records"** section, DELETE every record that points at Wix:
   - **A** record, host `@` / blank / `canineswhocare.org` → `185.230.63.x`  → **delete**
   - **A** or **CNAME** record, host `www` → Wix (`185.230.63.x` or `*.wixdns.net`) → **delete**
   - Any **CNAME/TXT** with `wixdns.net`, `_wix`, or Wix verification → delete (optional but tidy)

   > Only delete records pointing to Wix (`185.230.63.x` / `wixdns.net`). Leave
   > unrelated records (e.g. MX/mail records, DKIM) alone.

### Step 3 — Point the domain to DreamHost
**Easiest (recommended):** make DreamHost host it and let it manage the record.
1. **Manage Domains** → `canineswhocare.org` → make sure it's **"Fully hosted"**
   on DreamHost (not "Redirect" or "DNS only"). If it already is, DreamHost
   usually re-adds the correct A record automatically once the Wix one is gone.

**If you need to add it manually** (only if the apex doesn't auto-populate):
- **A** record — host: `@` (or leave blank) — value: *your DreamHost IP from Step 1*
- **A** record — host: `www` — value: *the same DreamHost IP*
  (or a **CNAME** — host: `www` — value: `canineswhocare.org.`)

### Step 4 — Wait for propagation
- Since DreamHost runs your nameservers, changes usually take **a few minutes to ~1 hour**
  (can be up to 24-48h in rare cases).
- Check progress at <https://dnschecker.org> — search `canineswhocare.org` and
  watch the IP change from `185.230.63.x` (Wix) to your DreamHost IP worldwide.

---

## How to verify the switch worked

Run any of these (or just reload the site after the cache clears):

```sh
# 1) Where does it resolve now? (should become your DreamHost IP)
dig +short canineswhocare.org

# 2) Who is serving it? (Wix shows "server: Pepyaka"; DreamHost shows Apache/nginx)
curl -sI https://canineswhocare.org | grep -i server

# 3) Is it YOUR new site? Look for content only on the new build, e.g. the
#    Active Teams gallery page that doesn't exist on Wix:
curl -s https://canineswhocare.org/active-teams.html | grep -i "Meet Our Active Teams"
```

When `dig` returns your DreamHost IP and the page is your new build, you're done.

---

## Gotchas

- **Browser/DNS cache:** after it propagates you may still see Wix locally for a bit.
  Hard-refresh (Cmd-Shift-R), try incognito, or flush DNS:
  `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder` (macOS).
- **HTTPS:** once the domain points to DreamHost, add the free Let's Encrypt SSL
  cert (panel → the domain → **HTTPS/SSL**), then uncomment the HTTPS-redirect
  lines in `.htaccess` and re-upload it. (See `DEPLOY.md`.)
- **Don't cancel Wix until the new site is confirmed live** on the domain — once
  DNS points away, the Wix site is no longer reachable on this domain anyway.
- **If the domain was bought through Wix:** your nameservers are already at
  DreamHost, so the DreamHost DNS panel is still the right (and only) place to
  fix this. No registrar change is needed unless you later want to move the
  registration itself.
