# arda92a.github.io

Personal site of **Arda Öztüner**: computer vision engineer and PhD researcher.

It's a plain static site (HTML, CSS and vanilla JS) with no build step, so GitHub Pages serves it as-is.

## Adding photos

1. Put images in the matching folder:

   | Card | Folder |
   | --- | --- |
   | SIU 2026: 1st Prize | `assets/img/awards/siu/` |
   | ESTÜ Project Fair: 1st Prize | `assets/img/awards/estu/` |
   | 2nd in the Faculty | `assets/img/awards/graduation/` |
   | Project galleries / covers | `assets/img/projects/` |

2. List them in [`assets/js/media.js`](assets/js/media.js) with an optional caption. By default the file expects
   `1.jpg`, `2.jpg`, … in each award folder. Missing files are skipped.

On an award card, the first three photos form the polaroid stack. Clicking the card fires confetti and opens the album.

Tip: resize photos to about 1600px on the long edge (JPG, quality ~80) so the page stays fast.

## Editing content

All text is in `index.html`. Project pop-up details are the `<template id="tpl-…">` blocks under the Projects section.

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Push to `main`. Under **Settings → Pages**, set the source to *Deploy from a branch* → `main` / `(root)`.
The site goes live at https://arda92a.github.io.
