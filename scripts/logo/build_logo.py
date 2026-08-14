"""Kshyovrata logo pipeline.

Reads the master artwork in `assets/KshyovrataLogo`, traces the raster layers
those files embed into real outlines, and writes the site's brand assets:

    public/logo.svg                 full lockup, outlined
    public/logo-mark.svg            mark on its own
    app/icon.svg                    favicon (emblem only)
    components/brand/logoPaths.ts   path data for the React components

The supplied files (1.svg full lockup, 2.svg mark + wordmark, 3.svg mark) are
SVG wrappers around raster layers, so they are ~130KB each, fixed in colour,
and soft when scaled. This turns those layers into curves once, offline.

    pip install pillow numpy potracer
    python scripts/logo/build_logo.py
"""

import base64
import io
import re
from pathlib import Path

import numpy as np
import potrace
from PIL import Image

from compress import compress, parse

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'assets' / 'KshyovrataLogo'
OUT = ROOT

UP = 4               # supersample before tracing
OPT = 0.4            # potrace curve-optimisation tolerance
PREC = 1             # decimals kept in the emitted path data

S = 0.749601         # the artwork's own scale factor
OX, OY = 249.617292, 161.164308      # emblem origin in the 940.5 canvas
INK = '#0A0A0A'
PAPER = '#FAF8F5'

# The three raster layers, identified by pixel size, and where each sits.
LAYERS = {
    'emblem':   ((628, 608), (249.617292, 161.164308)),
    'ornament': ((177, 99), (484.24254, 249.617277)),
    'sun':      ((99, 60), (440.016056, 557.703466)),
}


# --------------------------------------------------------------------- trace
def masks(svg_path):
    """The grayscale coverage masks embedded in a supplied logo file."""
    s = svg_path.read_text(encoding='utf-8')
    found = {}
    for b64 in re.findall(r'xlink:href="data:image/png;base64,([^"]+)"', s):
        im = Image.open(io.BytesIO(base64.b64decode(b64)))
        if im.mode == 'L':
            found[im.size] = im
    return found


def trace(im):
    w, h = im.size
    big = im.resize((w * UP, h * UP), Image.LANCZOS)
    # potracer inverts internally, so hand it the complement of the coverage.
    bmp = potrace.Bitmap(np.array(big) < 128)
    out = []
    for curve in bmp.trace(turdsize=2 * UP * UP, alphamax=1.0, opttolerance=OPT):
        sp = curve.start_point
        d = [f'M{sp.x / UP:.4f} {sp.y / UP:.4f}']
        for seg in curve:
            if seg.is_corner:
                d.append(f'L{seg.c.x / UP:.4f} {seg.c.y / UP:.4f}'
                         f'L{seg.end_point.x / UP:.4f} {seg.end_point.y / UP:.4f}')
            else:
                d.append(f'C{seg.c1.x / UP:.4f} {seg.c1.y / UP:.4f} '
                         f'{seg.c2.x / UP:.4f} {seg.c2.y / UP:.4f} '
                         f'{seg.end_point.x / UP:.4f} {seg.end_point.y / UP:.4f}')
        d.append('Z')
        out.append(''.join(d))
    return ' '.join(out)


def place(d, scale, off):
    """Absolute path, scaled and translated, kept at full precision."""
    out = []
    for cmd, pts in parse(d):
        if cmd == 'Z':
            out.append('Z')
            continue
        out.append(cmd + ' '.join(
            f'{x * scale + off[0]:.4f} {y * scale + off[1]:.4f}' for x, y in pts))
    return ''.join(out)


def bbox(d):
    xs, ys = [], []
    for cmd, pts in parse(d):
        for x, y in pts:
            xs.append(x)
            ys.append(y)
    return min(xs), min(ys), max(xs), max(ys)


# ------------------------------------------------------------------- gather
found = masks(SRC / '1.svg')
raw = {name: trace(found[size]) for name, (size, _) in LAYERS.items()}
for k, v in raw.items():
    print(f'traced {k:9s} {len(v):>7} chars')

# Text (wordmark + strapline) is already vector in the master files.
lockup_src = (SRC / '1.svg').read_text(encoding='utf-8')
groups = re.findall(
    r'<g fill="#171717" fill-opacity="1"><g transform="translate\(([-\d.]+), '
    r'([-\d.]+)\)"><g>(.*?)</g></g></g>', lockup_src, re.S)
wordmark, strapline = [], []
for x, y, inner in groups:
    for d in re.findall(r'd="([^"]+)"', inner):
        (wordmark if float(y) < 700 else strapline).append(
            place(d, 1.0, (float(x), float(y))))
wordmark = ''.join(wordmark)
strapline = ''.join(strapline)

# The two hairlines flanking the strapline, measured off their own masks.
RULES = [(131.9, 46.5), (814.8, 46.5)]
RULE_Y, RULE_H = 738.1, 1.7

# ------------------------------------------------------------- mark space
canvas = {n: place(raw[n], S, off) for n, (_, off) in LAYERS.items()}
ex0, ey0, ex1, ey1 = bbox(canvas['emblem'])
MW, MH = round(ex1 - ex0), round(ey1 - ey0)
mark = {n: compress(place(d, 1.0, (-ex0, -ey0)), PREC) for n, d in canvas.items()}
for k, v in mark.items():
    print(f'packed {k:9s} {len(v):>7} chars')
print(f'mark viewBox 0 0 {MW} {MH}')

# ----------------------------------------------------------- lockup space
lock_abs = dict(canvas, wordmark=wordmark, strapline=strapline)
xs, ys = [], []
for d in lock_abs.values():
    x0, y0, x1, y1 = bbox(d)
    xs += [x0, x1]
    ys += [y0, y1]
for rx, rw in RULES:
    xs += [rx, rx + rw]
ys += [RULE_Y, RULE_Y + RULE_H]

PAD = 26.0
LX, LY = min(xs) - PAD, min(ys) - PAD
LW, LH = round(max(xs) - min(xs) + 2 * PAD), round(max(ys) - min(ys) + 2 * PAD)
lock = {n: compress(place(d, 1.0, (-LX, -LY)), PREC) for n, d in lock_abs.items()}
rules = ''.join(
    f'<rect x="{rx - LX:.1f}" y="{RULE_Y - LY:.1f}" width="{rw}" height="{RULE_H}"/>'
    for rx, rw in RULES)
print(f'lockup viewBox 0 0 {LW} {LH}')

# ------------------------------------------------------------------ write
full = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {LW} {LH}" '
    f'width="{LW}" height="{LH}" role="img" aria-label="Kshyovrata">'
    f'<title>Kshyovrata</title>'
    f'<rect width="{LW}" height="{LH}" fill="#FFFFFF"/>'
    f'<g fill="{INK}" fill-rule="evenodd">'
    f'<path d="{lock["emblem"]}"/><path d="{lock["ornament"]}"/>'
    f'<path d="{lock["sun"]}"/><path d="{lock["wordmark"]}"/>'
    f'<path d="{lock["strapline"]}"/>{rules}</g></svg>\n')
(OUT / 'public' / 'logo.svg').write_text(full, encoding='utf-8')

markonly = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {MW} {MH}" '
    f'width="{MW}" height="{MH}" role="img" aria-label="Kshyovrata">'
    f'<title>Kshyovrata</title>'
    f'<g fill="{INK}" fill-rule="evenodd">'
    f'<path d="{mark["emblem"]}"/><path d="{mark["ornament"]}"/>'
    f'<path d="{mark["sun"]}"/></g></svg>\n')
(OUT / 'public' / 'logo-mark.svg').write_text(markonly, encoding='utf-8')

# Favicon: emblem only. The moon, stars and sun are hairlines that turn to
# noise inside a 32px tile.
PADI = 9
sc = (120 - 2 * PADI) / MW
icon_d = compress(place(place(canvas['emblem'], 1.0, (-ex0, -ey0)), sc,
                        (PADI, PADI + (120 - 2 * PADI - MH * sc) / 2)), PREC)
icon = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" '
    f'width="120" height="120"><title>Kshyovrata</title>'
    f'<rect width="120" height="120" fill="{PAPER}"/>'
    f'<path fill="{INK}" fill-rule="evenodd" d="{icon_d}"/></svg>\n')
(OUT / 'app' / 'icon.svg').write_text(icon, encoding='utf-8')

ts = f'''/**
 * KSHYOVRATA — logo geometry
 *
 * Outlines traced from the master artwork in `assets/KshyovrataLogo`. Those
 * files wrap raster art inside an SVG shell; these are real curves, so the
 * mark takes `currentColor`, stays crisp at any size, and costs no request.
 *
 * The three pieces share one coordinate space — {MW} x {MH}, origin at the
 * top-left of the emblem's bounding box. The emblem's box contains the other
 * two, so framing does not shift when the ornament is turned off.
 *
 * Generated by the logo pipeline. Edit the artwork, not this file.
 */

export const MARK_VIEWBOX = '0 0 {MW} {MH}';

/** The interlocked KHM monogram, swept through by the crescent. */
export const MARK_EMBLEM =
  '{mark["emblem"]}';

/** Crescent moon and three stars, upper right. */
export const MARK_ORNAMENT =
  '{mark["ornament"]}';

/** Rising sun, lower centre. */
export const MARK_SUN =
  '{mark["sun"]}';
'''
(OUT / 'components' / 'brand' / 'logoPaths.ts').write_text(ts, encoding='utf-8')

for f in ('public/logo.svg', 'public/logo-mark.svg', 'app/icon.svg',
          'components/brand/logoPaths.ts'):
    print(f'{f:34s} {(OUT / f).stat().st_size:>7} bytes')
