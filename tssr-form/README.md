# TSSR form

Single-file browser form for site survey (TSSR). Works offline, no install – open `TSSR_form.html` in any browser (desktop or phone).

**Subcontractor:** fill in the form → *Export Excel report* → send the `.xlsx` (plus photos from a separate folder). *Save draft / Load draft* lets you continue later.

**Maintaining the lists (Nokia HW, installation materials, dropdown values):**
1. Edit `catalog.xlsx` (see its READ ME sheet). Group `Radio Low / Radio Mid / Radio 2600 / Radio 5G / Mounting` feed the per-sector dropdowns.
2. Open `TSSR_form.html` → *Catalog* (bottom) → *Load catalog.xlsx* → *Save form with this catalog (HTML)* → distribute the new HTML.
   (Alternative for developers: `python3 build.py` rebuilds `TSSR_form.html` from `catalog.xlsx`.)

Files: `src/template.html` (app), `catalog.xlsx` (lists), `vendor/exceljs.min.js` (MIT, Excel read/write), `build.py`.
