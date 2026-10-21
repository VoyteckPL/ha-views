#!/usr/bin/env python3
"""Build TSSR_form.html (single self-contained file) from src/template.html + catalog.xlsx + vendor/exceljs.min.js.
Usage: python3 build.py"""
import json, pathlib, openpyxl
here = pathlib.Path(__file__).parent
wb = openpyxl.load_workbook(here / 'catalog.xlsx', read_only=True)
def rows(name):
    return [r for r in wb[name].iter_rows(min_row=2, values_only=True) if r[0] not in (None, '')]
s = lambda v: '' if v is None else str(v).strip()
cat = {
    'hw':  [dict(pn=s(r[0]), group=s(r[1]) or 'Other', desc=s(r[2]), notes=s(r[3])) for r in rows('Hardware')],
    'mat': [dict(code=s(r[0]), group=s(r[1]) or 'Other', desc=s(r[2]), src=s(r[3]), unit=s(r[4]) or 'pcs') for r in rows('Materials')],
    'lists': {},
}
ws = list(wb['Lists'].iter_rows(values_only=True))
for ci, name in enumerate(ws[0]):
    if name:
        cat['lists'][name] = [s(r[ci]) for r in ws[1:] if ci < len(r) and s(r[ci])]
js = json.dumps(cat, ensure_ascii=False).replace('<', '\\u003c')
html = (here / 'src/template.html').read_text(encoding='utf-8')
html = html.replace('__CATALOG__', js).replace('/*__EXCELJS__*/', (here / 'vendor/exceljs.min.js').read_text(encoding='utf-8'))
(here / 'TSSR_form.html').write_text(html, encoding='utf-8')
print('built TSSR_form.html', len(html) // 1024, 'KB;', len(cat['hw']), 'HW,', len(cat['mat']), 'materials')
