# Field Notes

A React and Vite source project for a nature photography portfolio.

## Run locally

Use Node.js 22 or newer. From the project folder, run:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Use `npm run build` to create the static site in `dist/`.

## Edit the gallery

1. Copy your web-ready JPEG, WebP, AVIF, or PNG files into `public/photos/`.
2. In `src/portfolio.js`, copy an existing entry and set its filename, title, category, and alt text. You can also add a location. Omit `thumbnail` unless you put a smaller copy with the same filename in `public/photos/thumbs/`. Each filename should be unique and match the file exactly.
3. Put your hero photo first in the array. The gallery uses cropped thumbnails and shows the full image when opened. Optional categories appear as filters when at least two distinct categories are present.
4. Edit the portfolio name, introduction, photographer name, and email in the same file. Update the browser title and description in `index.html` if you rename the portfolio. Leave the email blank to hide Contact.

The photo viewer supports left and right arrow keys to browse and Escape to close.

The included photographs are web-sized WebP copies. The gallery uses smaller thumbnails and loads the larger images in the viewer.
