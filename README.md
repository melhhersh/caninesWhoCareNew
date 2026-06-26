# Canines Who Care — Website

Static HTML/CSS/JS site for [Canines Who Care](https://www.canineswhocare.org/), a 501(c)(3)
nonprofit providing AKC-certified therapy dog services throughout Central Texas. Migrated from
Wix to a custom static site (no build step) for hosting on DreamHost.

## Pages

| File | Page |
|------|------|
| `index.html` | Home |
| `about-us.html` | About Us |
| `team-members.html` | Team Members |
| `active-teams.html` | Active Teams gallery |
| `retired-teams.html` | Retired Teams gallery |
| `memorial.html` | Memorial gallery |
| `contact.html` | Contact |
| `donate.html` | Donate |
| `404.html` | Not Found |

## Structure

- `css/style.css` — global stylesheet
- `js/main.js` — nav, mobile menu, fade-ins, gallery hover overlays, donation buttons, form AJAX
- `fonts/` — Gazpacho (headings) + Madefor Text (body) web fonts
- `images/` — site imagery, organized by section

## Donations

The donate page and the home "Support Our Cause" card offer three payment options:

- **PayPal** — PayPal Giving Fund fundraiser
- **Venmo** — `@CaninesWhoCare` (deep-links with the selected amount)
- **Zelle** — `canineswhocare@gmail.com`

## Forms

Contact and "Start Your Journey" forms submit via [Formspree](https://formspree.io) (AJAX).

## Deploying

No build step. Upload the project files (everything except the dev folders ignored in
`.gitignore`) to the web root on DreamHost.

## Local preview

```sh
python3 -m http.server 8080
# then open http://127.0.0.1:8080/
```
