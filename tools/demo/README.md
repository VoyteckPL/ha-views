# HA Views — web demo (sources)

The live demo runs the real HA Views interface in the browser, without Home Assistant and without the add-on server.

- `demo.js` answers the interface's `api/*` requests in the browser: example entities with live values, the sample layout, uploads. A visitor's changes are kept only in their own browser (localStorage / IndexedDB). **Reset** restores the example.
- `sw.js` is a small service worker that serves the background images, including images a visitor uploads.
- `make-layout.js` generates `demo-layout.js`, the sample dashboard.
- `plan-day.png` / `plan-night.png` (the home view) and `garden-day.png` / `garden-night.png` (the irrigation view) are the example backgrounds.
- The example has two views: **Home** (four temperature labels and one flow) and **Irrigation** (sprinklers on a lawn, a drip line on raised beds, a valve and a soil moisture label).

Build (copies the add-on frontend and these files into `docs/demo/`, which GitHub Pages serves):

```
node tools/demo/make-layout.js
python3 tools/demo/build-demo.py ha_views/app/rewrite docs/demo "<version label>"
```
