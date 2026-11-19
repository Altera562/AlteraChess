# Chess Studio (PWA)

Static site, no build step.

1. Upload all files in this folder to the root of your GitHub repo.
2. Repo Settings > Pages > Deploy from a branch > main, folder / (root).
3. Open the Pages link. On a phone: Share / browser menu > Add to Home Screen.

Files: index.html (screens), style.css, engine.js (rules), bot.js (AI), app.js (UI), sw.js (offline), manifest.webmanifest, icons.

Stockfish: sf.js + stockfish-19-lite-single.js/.wasm (Stockfish.js, GPLv3, https://github.com/nmrugg/stockfish.js) power bot levels 8-10 in standard chess. Keep this repo public and keep the GPL license notice in the js file.
