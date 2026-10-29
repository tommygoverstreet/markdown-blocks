# Markdown Blocks

A block based markdown editor that runs entirely in the browser. Drag, drop and reorder blocks, edit per-block HTML attributes, preview live in several themes, and export `.md` or a styled `.html` page. Installable as a PWA and usable offline. No build step and no runtime dependencies.

## Features

- 14 block types: heading, paragraph, bulleted/numbered/task lists, quote, code, table, image, link, divider, callout, collapsible, contents
- Drag and drop on desktop, touch drag on phones and tablets, plus up/down buttons
- Fold sections or single blocks, full screen panels, collapsible bottom preview on small screens
- Auto-convert shortcuts (`## `, `- `, `1. `, `[ ] `, `> `, ` ``` `, `---`), paste markdown to split into blocks, import markdown
- 20+ templates: sales, accounting, business, web development, documentation, SEO and AEO, resume
- Per-block attributes (id, class, style, data-*) and a custom CSS box for your own classes
- 7 app themes and 6 output themes; undo/redo; autosave in the browser
- Offline support and install prompt through a service worker and web manifest

## Run locally

```bash
npm start        # serves ./public with npx serve
npm run check    # syntax check, file references, manifest
```

Any static server works (`python3 -m http.server -d public`). The service worker only registers on `https` or `localhost`.

## Deploy to Netlify

1. Push this folder to a GitHub repository.
2. In Netlify choose **Add new site, Import an existing project**, pick the repo.
3. Leave the build command empty. `netlify.toml` already sets the publish directory to `public` and adds security and cache headers.

Or drag the `public` folder onto https://app.netlify.com/drop.

## Project structure

```
public/
  index.html            App shell. Script order matters (see below).
  sw.js                 Service worker. Bump VERSION when you change cached files.
  manifest.webmanifest  PWA manifest
  css/                  tokens, app, output-themes, responsive, polish, modern (makeover skin, loaded last)
  js/
    config/             blocks.js (block registry), templates.js
    core/               state.js, markdown.js (parse/serialize/render), history.js
    ui/                 canvas, palette, drawer, themes, preview, touch drag, toasts...
    io/files.js         import, copy, export
    main.js             boot
scripts/check.mjs       CI checks
netlify.toml            Netlify config and headers
```

The scripts are classic scripts that share one global scope and load in the order listed in `index.html`. New files should wrap their code in an IIFE unless they intentionally export a global.

## Extending

**Add a template.** In `js/config/templates.js` add a markdown string to `TP2` and list its name in a group in `TPLG`.

**Add an app theme.** Add a `:root[data-theme=name]{...}` block in `css/tokens.css` and its name in `AT` in `js/ui/themes.js`.

**Add an output theme.** Add `#out[data-ot=name],#dko[data-ot=name]{...}` in `css/output-themes.css` and its name in `OTS` in `js/ui/themes.js`.

**Add a block type.** Touch four places:
1. `js/config/blocks.js`: label, icon, colour in `T`.
2. `js/core/markdown.js`: a `case` in `md()` (markdown out), `html()` (preview/export) and, if it has new syntax, `parse()`.
3. `js/ui/blocks.js`: a `case` in `body()` (editor fields).
4. Any extra fields go on the block via `nb()` in `js/core/state.js`.

## Security notes

The site ships a strict Content Security Policy (no inline scripts). Block attributes starting with `on` are dropped, and preview links and images block `javascript:` and `data:` URLs.

## License

MIT
