#!/usr/bin/env python3
"""
Generate responsive AVIF/WebP/raster variants for oversized images.

Matches the convention already used by the hero and team images:
  foo.jpg -> foo-480w.{avif,webp,jpg}
             foo-768w.{avif,webp,jpg}
             foo-1024w.{avif,webp,jpg}
The untouched original stays in place as the final fallback.

Also writes src/data/image-variants.json, a manifest consumed by
<ResponsiveImage> so data-driven images (blog cards, blog heroes) can
render a <picture> without hardcoding paths in JSX.

Quality settings are deliberately conservative — these are patient-facing
photos of real staff and children.
"""

import json
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, 'public')
MANIFEST = os.path.join(ROOT, 'src', 'data', 'image-variants.json')

WIDTHS = [480, 768, 1024]

AVIF_QUALITY = 55
WEBP_QUALITY = 82
JPEG_QUALITY = 88

# Public-relative paths of images that are served far above their display size.
TARGETS = [
    '/images/child_airway_hero_1765825276038.png',
    '/images/blog/dental-implants-hero.png',
    '/images/blog/signs-child-early-orthodontic-assessment.png',
    '/images/blog/mouth-breathing-thumb-sucking-crowded-teeth.png',
    '/images/blog/child-candidate-myofunctional-orthodontics.jpg',
    '/images/blog/adult-mouth-breathing-hero.jpg',
    '/images/team_group.jpg',
    # Added 2026-08-10 for the "Keep reading" cards on the service pages.
    # These render in a ~370px box (320px in the mobile carousel) but several
    # of the originals are 0.5-2 MB, so without variants the new section would
    # hand back the payload the July perf sprint clawed out.
    '/images/blog/asian_couple_40s.png',
    '/images/blog/concerned_person_brushing.png',
    '/images/blog/dental-crowns-malaysia-hero.jpg',
    '/images/blog/dental-crowns-vs-fillings-hero.jpg',
    '/images/blog/dentist_xray.png',
    '/images/blog/early-orthodontic-assessment-children-hero.jpg',
    '/images/blog/invisalign-malaysia-hero.jpg',
    '/images/blog/invisalign_hero.png',
    '/images/blog/myofunctional-therapy-before-after-braces-hero.png',
    '/images/blog/root_canal_vs_extraction_hero.png',
    '/images/blog/teeth-whitening-sensitive-teeth-hero.jpg',
    '/images/blog/when-should-children-stop-sucking-thumb-hero.jpg',
    '/images/blog/why-baby-teeth-matter-hero.jpg',
    '/images/bone_loss_hero_1765825236985.png',
    '/images/dentist-child.png',
    '/images/family_hero_three_generations.jpg',
    '/images/invisalign_hand.png',
    '/images/mouth_breathing_sleep.png',
    '/images/sensitivity_hero_1765825197668.png',
    '/images/service_enhance.png',
    '/images/service_straighten.png',
    '/images/veneers_hero_1765825257935.png',
]

# Images that are simply too large for their display box and just need
# resizing in place (no responsive set). (path, max_edge)
DOWNSCALE_IN_PLACE = [
    ('/logo.webp', 320),
]


def raster_ext(src_ext):
    """PNG photographs get a JPEG fallback — a downscaled PNG is still huge."""
    return '.jpg' if src_ext.lower() == '.png' else src_ext.lower()


def save_raster(img, path, ext):
    if ext in ('.jpg', '.jpeg'):
        img.convert('RGB').save(path, 'JPEG', quality=JPEG_QUALITY, optimize=True, progressive=True)
    else:
        img.save(path, optimize=True)


def build_variants(rel_path):
    abs_path = os.path.join(PUBLIC, rel_path.lstrip('/'))
    if not os.path.exists(abs_path):
        print(f'  ✗ missing {rel_path}')
        return None

    name, ext = os.path.splitext(rel_path)
    fallback_ext = raster_ext(ext)

    src = Image.open(abs_path)
    src_w, src_h = src.size
    src_rgb = src.convert('RGB') if src.mode in ('RGBA', 'P') else src

    entries = []
    for w in WIDTHS:
        if w > src_w:
            continue  # never upscale
        h = round(src_h * w / src_w)
        resized = src_rgb.resize((w, h), Image.LANCZOS)

        out = {}
        for fmt, fmt_ext, saver in (
            ('AVIF', '.avif', lambda im, p: im.save(p, 'AVIF', quality=AVIF_QUALITY)),
            ('WEBP', '.webp', lambda im, p: im.save(p, 'WEBP', quality=WEBP_QUALITY, method=6)),
            ('RASTER', fallback_ext, lambda im, p: save_raster(im, p, fallback_ext)),
        ):
            rel_out = f'{name}-{w}w{fmt_ext}'
            abs_out = os.path.join(PUBLIC, rel_out.lstrip('/'))
            saver(resized, abs_out)
            size = os.path.getsize(abs_out)
            print(f'  ✓ {fmt:6s} {rel_out}  ({size // 1024}KB)')
            out['avif' if fmt == 'AVIF' else 'webp' if fmt == 'WEBP' else 'raster'] = rel_out

        entries.append({'w': w, **out})

    return {
        'width': src_w,
        'height': src_h,
        'original': rel_path,
        'fallbackType': 'image/jpeg' if fallback_ext in ('.jpg', '.jpeg') else 'image/png',
        'variants': entries,
    }


def downscale_in_place(rel_path, max_edge):
    abs_path = os.path.join(PUBLIC, rel_path.lstrip('/'))
    if not os.path.exists(abs_path):
        print(f'  ✗ missing {rel_path}')
        return
    before = os.path.getsize(abs_path)
    img = Image.open(abs_path)
    w, h = img.size
    if max(w, h) <= max_edge:
        print(f'  ○ {rel_path} already <= {max_edge}px')
        return
    scale = max_edge / max(w, h)
    resized = img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    resized.save(abs_path, 'WEBP', quality=90, method=6)
    after = os.path.getsize(abs_path)
    print(f'  ✓ {rel_path} {w}x{h} -> {resized.size[0]}x{resized.size[1]}  '
          f'({before // 1024}KB -> {after // 1024}KB)')


def main():
    manifest = {}
    for rel in TARGETS:
        print(rel)
        entry = build_variants(rel)
        if entry:
            manifest[rel] = entry

    print('\nDownscale in place:')
    for rel, max_edge in DOWNSCALE_IN_PLACE:
        downscale_in_place(rel, max_edge)

    os.makedirs(os.path.dirname(MANIFEST), exist_ok=True)
    with open(MANIFEST, 'w') as f:
        json.dump(manifest, f, indent=2, sort_keys=True)
        f.write('\n')
    print(f'\nWrote manifest: {os.path.relpath(MANIFEST, ROOT)} ({len(manifest)} images)')


if __name__ == '__main__':
    main()
