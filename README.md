# Tasha's Portfolio

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
2. In `src/portfolio.js`, copy an existing entry and set its filename, title, alt text, width, and height. Use the dimensions of the image displayed in the gallery. You can also add a location. Omit `thumbnail` unless you put a smaller copy with the same filename in `public/photos/thumbs/`. Each filename should be unique and match the file exactly.
3. Set `portfolio.banner` to the filename of the photo you want to feature. The gallery shows the full frame and opens a larger image in the viewer.
4. Edit the portfolio name, subtitle, photographer name, and email in the same file. Update the browser title and description in `index.html` if you rename the portfolio. Leave the email blank to hide Contact.

The photo viewer supports left and right arrow keys to browse and Escape to close.

The included photographs are web-sized WebP copies. The gallery uses smaller thumbnails and loads the larger images in the viewer.
