#!/usr/bin/env python3
"""Builds the HA Views web demo: build-demo.py <add-on rewrite dir> <output dir> <version label>"""
import os, re, shutil, sys
src, out, version = sys.argv[1], sys.argv[2], sys.argv[3]
here = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(out, 'rewrite-assets'), exist_ok=True); os.makedirs(os.path.join(out, 'backgrounds'), exist_ok=True)
for f in ('app.js', 'app.css'): shutil.copy(os.path.join(src, f), os.path.join(out, 'rewrite-assets', f))
for f in ('demo.js', 'demo-layout.js', 'sw.js'): shutil.copy(os.path.join(here, f), os.path.join(out, f))
for f in ('plan-day.png', 'plan-night.png'): shutil.copy(os.path.join(here, f), os.path.join(out, 'backgrounds', f))
html = open(os.path.join(src, 'index.html'), encoding='utf-8').read()
m = re.search(r'\s*<script type="module" src="(rewrite-assets/app\.js[^"]*)"></script>', html)
assert m, 'app.js script tag not found'
app = m.group(1)
html = html.replace(m.group(0), '')
html = re.sub(r'<title>[^<]*</title>', '<title>HA Views — live demo</title>', html, count=1)
head = f'''  <meta name="description" content="HA Views live demo: visual Home Assistant dashboards on your own floor plan. Runs entirely in your browser.">
  <style>
    #demo-bar{{position:fixed;left:10px;bottom:10px;z-index:60;display:flex;align-items:center;gap:8px;max-width:calc(100vw - 20px);padding:6px 8px 6px 12px;border:1px solid rgba(99,181,216,.4);border-radius:999px;background:rgba(6,22,32,.92);color:#cfe6f1;font:12px/1.3 system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.45);backdrop-filter:blur(6px)}}
    #demo-bar b{{color:#5cdbff}}#demo-bar a,#demo-bar button{{display:inline-flex;align-items:center;height:26px;padding:0 10px;border:1px solid rgba(99,181,216,.35);border-radius:999px;background:#0d2e3e;color:#dff6ff;font:inherit;text-decoration:none;cursor:pointer;white-space:nowrap}}
    #demo-bar .demo-note{{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
    body.editing #demo-bar{{opacity:.35}}body.editing #demo-bar:hover{{opacity:1}}
    @media (max-width:640px){{#demo-bar .demo-note{{display:none}}}}
  </style>
  <script>window.HA_VIEWS_DEMO_APP = {app!r};</script>
  <script src="demo-layout.js"></script>
  <script src="demo.js"></script>
</head>'''
html = html.replace('</head>', head, 1)
bar = f'''  <div id="demo-bar" data-no-i18n><b>HA Views demo</b><span class="demo-note">{version} · example data · your changes stay in this browser</span><button type="button" onclick="haViewsDemoReset()" title="Restore the example dashboard">Reset</button><a href="https://github.com/VoyteckPL/ha-views" target="_blank" rel="noopener">Get the add-on</a></div>
</body>'''
html = html.replace('</body>', bar, 1)
open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(html)
print('demo built:', out, 'app:', app)
