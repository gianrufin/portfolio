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
```

## Design

The palette is pulled straight from the portrait: **ink** `#0B0C0E`, **cream** `#F0EEE2`,
**marigold** `#F5C518`. Display type is Instrument Serif, body is Inter, micro-labels are
JetBrains Mono.

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

`.github/workflows/deploy.yml` publishes the repo root to GitHub Pages on every push.

**One-time setup (has to be done by the repo owner, in the browser):**

> [Settings → Pages](https://github.com/gianrufin/works/settings/pages) →
> Build and deployment → **Source: GitHub Actions**

This can't be automated — a workflow's `GITHUB_TOKEN` isn't allowed to create a Pages
site (`Resource not accessible by integration`), so the toggle has to be flipped once by
hand. After that, re-run the latest **Deploy to GitHub Pages** workflow (or push any
commit) and the site goes live at:

**https://gianrufin.github.io/works/**

## Content sources

Every project blurb, feature list and link on the page came from the live sites themselves —
the Linktree profile, wegather.studio, and each product's landing page. Nothing is invented.
