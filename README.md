# SEA Climbforge — League of Legends Boosting (SEA)

A single-purpose storefront for **League of Legends boosting on the SEA server only**.
No Valorant, no TFT, no Wild Rift, no account shop — one game, fixed PHP prices,
GCash payment, and a Facebook-first inquiry flow.

Frontend reference: a dark, card-based boosting layout (hero headline, service
cards, 3-step stepper, price board, reviews). This repo adapts that language to
a LoL-only catalog with a clean static hero.

Live contact: <https://www.facebook.com/boostingservices123>

> Not affiliated with Riot Games. League of Legends and all rank emblems are
> trademarks of Riot Games, Inc.

---

## 1. What this is

| Item | Value |
|---|---|
| Brand | SEA Climbforge |
| Game | League of Legends, SEA server only |
| Currency | PHP |
| Payment | GCash (manual confirmation) |
| Order path | Facebook message → quote → manual confirmation → progress updates |
| Stack | TanStack Start + React 19, Vite, Tailwind v4, Cloudflare Workers |
| Hero | Static block (`src/routes/index.tsx` + `.hero*` styles) on a solid background |

### LoL-only services

- **Solo Boost** — a booster plays your account to the target rank.
- **Duo Boost** — climb together, listed price + 40%.
- **Placement Matches** — priced from current/historical rank.
- **Promotion Packages** — fixed Iron → Master ladder (see price board).
- **Per-Rank Climb** — per-division pricing from your current rank.
- **Coaching** — VOD review / live session (ask on Facebook for slots).

Anything outside Summoner's Rift on SEA (other Riot titles, other regions,
account sales, cheats/scripts) is out of scope and declined.

---

## 2. Pricing (PHP, SEA only)

### Promotion packages (fixed rate)

| Route | Price |
|---|---|
| Iron 1 to Bronze 4 | PHP 60 |
| Bronze 1 to Silver 4 | PHP 75 |
| Silver 1 to Gold 4 | PHP 105 |
| Gold 1 to Platinum 4 | PHP 175 |
| Platinum 1 to Emerald 4 | PHP 220 |
| Emerald 1 to Diamond 4 | PHP 270 |
| Diamond 1 to Master | PHP 300 |

### Per-rank climb (from current rank)

| Current | Rate |
|---|---|
| Iron | PHP 40 / rank |
| Bronze | PHP 65 / rank |
| Silver | PHP 80 / rank |
| Gold | PHP 95 / rank |
| Platinum | PHP 140 / rank |
| Emerald | PHP 235 / rank |
| Diamond | PHP 250 / rank |
| Master | PHP 350 / 100 LP |

Duo boosting adds **40%** to the listed price. Final quote is always confirmed
on Facebook before play starts — the board never charges directly.

---

## 3. How it works

1. **Select service** — send current rank, target, queue (Solo/Duo/Flex),
   champions/roles, and availability via the inquiry form or Facebook.
2. **Complete payment** — GCash details + total confirmed manually. No
   card form on this site.
3. **Rank up** — booster plays (or queues with you for Duo), you get
   progress updates until the final screenshot.

Typical reply window and ETA are confirmed per order — queue, division gap,
and booster availability all move it.

---

## 4. Repo layout

```text
league-boosting-site/
  README.md                      ← you are here
  package.json                   ← npm scripts (dev / build / typecheck)
  src/
    routes/index.tsx             ← page composition (hero, services, prices, FAQ, contact)
    routes/__root.tsx            ← app shell (head tags, outlet)
    styles.css                   ← site tokens + section styles (rankforge theme)
    app-meta.json                ← og_title / og_description / images
  public/favicon.svg             ← SR crest favicon
  design-brief.md                ← locked palette, type, section shape
```

---

## 5. Local development — start it on your machine

Prerequisites: Node 20+, npm (or `bun` 1.3+). Works in WSL / Ubuntu and in
VS Code terminals.

### 5.1 Open the right folder

The site lives at the repo root — the folder with `package.json`,
`vite.config.ts`, and `src/`. All commands below run from there:

```bash
cd league-boosting-site
pwd   # should end in .../league-boosting-site
```

### 5.2 Install dependencies (first time only)

```bash
npm install
```

### 5.3 Start the dev server

This project already **is React** (React 19 + TSX via TanStack Start) — no
rewrite needed:

```bash
npm run dev
# under the hood: `vite dev` (TanStack Start + HMR, file polling enabled)
```

Then open the URL printed in the terminal — usually:

```text
http://localhost:5173/
```

You should see the hero ("Get to your desired division today."),
followed by the services grid, price board, FAQ, and inquiry form. Edit
`src/routes/index.tsx` or `src/styles.css` and the page hot-reloads.

To stop the server: `Ctrl + C`.

### 5.4 Other commands you will use

```bash
npm run dev        # dev server with HMR
npm run typecheck  # regenerates route tree (tsr) + tsc --noEmit
npm run build      # tsr + tsc + vite build (same as CI)
npm run preview    # serve the production build locally
npm run lint       # eslint
npm run format     # prettier --write .
```

### 5.5 Troubleshooting

| Symptom | Fix |
|---|---|
| Port already in use | `npm run dev -- --port 5174`, or kill the old process: `lsof -i :5173` then `kill <pid>`. |
| Changes do not hot-reload | The watcher uses polling (`usePolling: true` in `vite.config.ts`) for synced dirs — wait a second, or restart `npm run dev`. |
| `node` version errors | Use Node 20: `nvm use 20` (check with `node --version`). |

### Required completion checks

```bash
npm run typecheck
npm run build
```

---

## 6. Customizing

### Change prices

Edit the `rankPrices` / `climbRates` arrays in `src/routes/index.tsx`. They
render both the service cards ("from" prices) and the price board. Duo +40% is
a copy note in two places — update both if the policy changes. The climb
calculator (`src/lib/pricing.ts`) derives its math from the same board:
per-rank rates inside a tier, promotion packages on tier-promotion steps —
update `PER_RANK_RATE` / `PROMOTION_STEP` to match.

### Change hero copy

Edit the `hero` section at the top of `src/routes/index.tsx` (kicker, `h1`,
intro paragraph, tags, CTAs) and the matching `.hero*` styles in
`src/styles.css`. The hero is a static block on a solid background — no video,
no scroll engine.

### Change contact destinations

Every customer-facing destination lives in `src/lib/contact.ts`: the Facebook
URL, TikTok URL/handle, Discord handles (one per booster), and the GCash/Maya
numbers shown in the payment strip. Update values there and the whole site
follows — nav, hero, channel cards, footer, and the copied inquiry text.
The form itself is a `mailto`-free lead capture: on submit it opens Facebook
with the inquiry — no backend, no DB.

### Add testimonials

Real client reviews only — never invent entries. Drop result screenshots in
`public/reviews/`, then add one object per order to the `testimonials` array
in `src/routes/index.tsx`:

```tsx
{
  quote: "Fast climb, updated me after every session.",
  name: "Juan D.",
  detail: "Gold 4 → Platinum 4 · Solo",
  image: "/reviews/juan-g4-p4.jpg", // optional
}
```

The Recent Climbs section renders the grid automatically; while the array is
empty it shows a link to the Facebook page instead.

### Change SEO / social

Edit `src/app-meta.json`: `og_title`, `og_description`, `favicon_url`,
`og_image_url`. URLs are root-relative so they resolve against whoever serves
the page (see `src/routes/__root.tsx`).

---

## 7. Rendering contract

- **SSR safety:** no browser globals at module top level or during render.
  A top-level `window` reference crashes SSR.
- **Motion:** `prefers-reduced-motion` disables smooth scrolling (see the CSS
  fallback in `src/styles.css`).
- **Palette:** hex/`rgb()` live in `src/styles.css` custom properties — keep
  them out of route files and use the `rankforge` classes instead.

---

## 8. Fixes applied in this pass

- LoL-only catalog: removed multi-game nav/cards from the reference; all
  Valorant/TFT/Wild Rift/Overwatch entries were cut, Duo +40% kept as policy.
- Inquiry form: `type="button"` + `window.open` replaced with a real anchor
  CTA (`Continue on Facebook`) and associated `<label htmlFor>` / `id`
  pairs, so keyboard + submit + SSR all behave.
- Navigation: added Services / Reviews / FAQ anchors, a skip link, and a
  `trust-section` id so every nav target exists.
- `check:ui` compliance: no hex / `rgb()` / `dark:` / arbitrary color classes
  in route files; palette stays in `src/styles.css` and scene tokens.
- Heading order: single `h1` in the hero, `h2` per content section.
- Static hero: the old video scroll-scrub hero (rank-emblem background) was
  replaced with a clean solid-background hero; the engine, scene data, and
  ~5.6 MiB of rank-graphic media were removed.

---

## 9. Roadmap (suggested, not built)

- [ ] Order calculator (current → target → Solo/Duo total, client-side only)
- [ ] Rank-icon set + champion/role picker wired into the inquiry message
- [ ] FAQ JSON-LD + Open Graph image for social sharing
- [ ] Rate-limit / spam honeypot on the form once a backend exists
- [ ] PH/EN copy toggle (currently EN only)

---

## 10. License / use

Private storefront code for SEA Climbforge. No license granted for reuse of the
brand, pricing, or media.
