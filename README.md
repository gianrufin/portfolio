# Gian Rufin — Portfolio

A single-page portfolio for **Gian Rufin** — graphic designer, brand manager, and founder of
[WeGather.Studio](http://wegather.studio) — built from the projects listed on
[linktr.ee/gianrufin](https://linktr.ee/gianrufin).

No frameworks, no build step, no dependencies. Three files do the whole thing.

```
index.html            structure + the eight hand-built app mockups
assets/css/main.css   design system, layout, motion
assets/js/main.js     scroll, cursor, parallax, filters
assets/avatar.jpg     portrait (from the Linktree profile)
assets/wegather-thumb.jpg  studio site thumbnail
assets/og-image.jpg   social share card (2400x1260, rendered from the hero)
```

## Design

The palette is pulled straight from the portrait: **ink** `#0B0C0E`, **cream** `#F0EEE2`,
**marigold** `#F5C518`.

Type is **Space Grotesk** and nothing else — display, body, UI and micro-labels, one
family, one request. Space Grotesk ships no italic, so accent words (*gathers*, *made*,
*mark*) are set in marigold with an underline that draws itself in when the heading
reveals, rather than in an italic that doesn't exist.

Each of the eight products gets its own accent colour and a bespoke phone mockup built in
pure CSS — an animated focus dial for Tempo, a scanning receipt for BiteSize, flipping tiles
for Wordle Tagalog, a swaying compass for Needledrop, and so on. They animate when they
scroll into view.

## Interactions

- Intro loader with a progress counter, then a masked headline reveal
- Custom cursor that grows and labels itself over links (`data-cursor="open"`)
- Magnetic buttons, 3D tilt on the phones and the portrait
- Scroll-linked parallax on floating elements, the portrait, and the studio shot
- Scroll-velocity-reactive marquee
- A sticky section where vertical scroll drives a horizontal track ("Craft")
- Filterable work grid with staggered re-entry
- Dark/light theme toggle, remembered in `localStorage`

Everything is keyboard-navigable, and `prefers-reduced-motion` disables the animation,
the parallax, the loader and the horizontal scroll hijack.

## Running locally

Any static server works:

```bash
npx http-server -p 8000
# → http://localhost:8000
```

## Deploying

> This repo is expected to be named **`portfolio`** so the site lands at
> `gianrufin.github.io/portfolio`. A project site's path is always the repo name —
> rename under Settings → General if it is still `works`.

`.github/workflows/deploy.yml` publishes the repo root to GitHub Pages on every push.

**One-time setup (has to be done by the repo owner, in the browser):**

> [Settings → Pages](https://github.com/gianrufin/portfolio/settings/pages) →
> Build and deployment → **Source: GitHub Actions**

This can't be automated — a workflow's `GITHUB_TOKEN` isn't allowed to create a Pages
site (`Resource not accessible by integration`), so the toggle has to be flipped once by
hand. After that, re-run the latest **Deploy to GitHub Pages** workflow (or push any
commit) and the site goes live at:

**https://gianrufin.github.io/portfolio/**

## Social sharing

`assets/og-image.jpg` is the Facebook / LinkedIn / X preview — the hero rendered at
2400x1260 (the 1.91:1 OG ratio). Regenerate it by screenshotting the hero at a
1200x630 viewport with `deviceScaleFactor: 2`.

**The og:image URL is absolute and hardcoded** (`https://gianrufin.github.io/portfolio/...`)
because every scraper rejects relative paths. If the repo is ever renamed again, update
the `og:image`, `og:url`, `twitter:image` and `canonical` tags in `index.html` to match,
or the preview silently breaks.

After deploying, force the platforms to re-scrape — they cache aggressively:
[Facebook debugger](https://developers.facebook.com/tools/debug/) ·
[LinkedIn inspector](https://www.linkedin.com/post-inspector/)

## Content sources

Every project blurb, feature list and link on the page came from the live sites themselves —
the Linktree profile, wegather.studio, and each product's landing page. Nothing is invented.
