#!/usr/bin/env python3
"""
Generate WebP and AVIF variants for all PNG/JPG images in public/images/.
- WebP: quality 80 (for PNGs/JPGs missing WebP)
- AVIF: quality 50 (for ALL images — ~40% smaller than WebP)
- Skips images that already have the target format
"""

import os
import sys
from PIL import Image

IMAGES_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'images')
WEBP_QUALITY = 80
AVIF_QUALITY = 50

# Skip test/placeholder files
SKIP_PATTERNS = [
    'dental-implants-test',
    'localhost_page_',
    'myobrace-hero',
]

def should_skip(filename):
    for pat in SKIP_PATTERNS:
        if pat in filename:
            return True
    return False

def process_image(filepath):
    """Generate WebP and/or AVIF for a single image."""
    dirname = os.path.dirname(filepath)
    basename = os.path.basename(filepath)
    name, ext = os.path.splitext(basename)
    ext = ext.lower()

    if ext not in ('.png', '.jpg', '.jpeg'):
        return []

    if should_skip(basename):
        return []

    results = []
    try:
        img = Image.open(filepath)
        img_rgb = img.convert('RGB') if img.mode in ('RGBA', 'P') else img

        # WebP (only if missing)
        webp_path = os.path.join(dirname, f'{name}.webp')
        if not os.path.exists(webp_path):
            try:
                if img.mode in ('RGBA', 'P'):
                    img.save(webp_path, 'WEBP', quality=WEBP_QUALITY, lossless=False)
                else:
                    img_rgb.save(webp_path, 'WEBP', quality=WEBP_QUALITY)
                results.append(('WEBP', webp_path, os.path.getsize(webp_path)))
            except Exception as e:
                print(f'  ⚠ WEBP failed for {basename}: {e}')

        # AVIF (always generate if missing)
        avif_path = os.path.join(dirname, f'{name}.avif')
        if not os.path.exists(avif_path):
            try:
                img_rgb.save(avif_path, 'AVIF', quality=AVIF_QUALITY)
                results.append(('AVIF', avif_path, os.path.getsize(avif_path)))
            except Exception as e:
                print(f'  ⚠ AVIF failed for {basename}: {e}')

        return results
    except Exception as e:
        print(f'  ✗ Error processing {basename}: {e}')
        return []

def main():
    images = []
    for root, dirs, files in os.walk(IMAGES_DIR):
        for f in sorted(files):
            if f.lower().endswith(('.png', '.jpg', '.jpeg')):
                images.append(os.path.join(root, f))

    total_webp = 0
    total_avif = 0

    print(f'Found {len(images)} images to process...\n')

    for filepath in images:
        relpath = os.path.relpath(filepath, os.path.join(IMAGES_DIR, '..'))
        results = process_image(filepath)
        if results:
            original_size = os.path.getsize(filepath)
            for fmt, path, size in results:
                rel = os.path.relpath(path, os.path.join(IMAGES_DIR, '..'))
                savings = 100 * (1 - size / original_size) if original_size > 0 else 0
                status = '✓' if size < original_size else '○'
                print(f'  {status} {fmt:4s} {rel}  ({size//1024}KB, {savings:.0f}% vs original)')
                if fmt == 'WEBP':
                    total_webp += 1
                else:
                    total_avif += 1

    print(f'\nDone! Generated {total_webp} WebP + {total_avif} AVIF variants')

if __name__ == '__main__':
    main()
