#!/usr/bin/env python3
"""
Generate Sahay app icon and splash assets.
Run: pip install Pillow && python generate_assets.py
"""
from PIL import Image, ImageDraw, ImageFont
import math, os

PURPLE = (108, 99, 255)
WHITE  = (255, 255, 255)
CLEAR  = (0, 0, 0, 0)

ASSETS = os.path.join(os.path.dirname(__file__), 'assets')

def heart(draw, cx, cy, size, color):
    """Parametric heart shape."""
    pts, steps = [], 720
    for i in range(steps):
        t = 2 * math.pi * i / steps
        x = 16 * math.sin(t) ** 3
        y = -(13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
        s = size / 34
        pts.append((cx + x * s, cy + y * s))
    draw.polygon(pts, fill=color)

def icon(size=1024):
    img  = Image.new('RGBA', (size, size), (*PURPLE, 255))
    draw = ImageDraw.Draw(img)
    heart(draw, size // 2, size // 2, int(size * 0.55), WHITE)
    return img

def foreground(size=1024):
    img  = Image.new('RGBA', (size, size), CLEAR)
    draw = ImageDraw.Draw(img)
    heart(draw, size // 2, size // 2, int(size * 0.55), WHITE)
    return img

def background(size=1024):
    return Image.new('RGBA', (size, size), (*PURPLE, 255))

def splash(size=512):
    """White heart + 'Sahay' text — transparent bg (purple comes from app.json)."""
    img  = Image.new('RGBA', (size, size), CLEAR)
    draw = ImageDraw.Draw(img)
    heart(draw, size // 2, int(size * 0.42), int(size * 0.48), WHITE)

    font_paths = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
        '/System/Library/Fonts/Helvetica.ttc',
    ]
    font = ImageFont.load_default()
    for fp in font_paths:
        if os.path.exists(fp):
            font = ImageFont.truetype(fp, int(size * 0.13))
            break

    text = 'Sahay'
    bbox = draw.textbbox((0, 0), text, font=font)
    tw   = bbox[2] - bbox[0]
    draw.text(((size - tw) // 2, int(size * 0.73)), text, fill=WHITE, font=font)
    return img

def favicon(size=64):
    img  = Image.new('RGBA', (size, size), (*PURPLE, 255))
    draw = ImageDraw.Draw(img)
    heart(draw, size // 2, size // 2, int(size * 0.55), WHITE)
    return img

if __name__ == '__main__':
    os.makedirs(ASSETS, exist_ok=True)

    tasks = [
        ('icon.png',                      icon(1024)),
        ('splash-icon.png',               splash(512)),
        ('android-icon-foreground.png',   foreground(1024)),
        ('android-icon-background.png',   background(1024)),
        ('android-icon-monochrome.png',   foreground(1024)),
        ('favicon.png',                   favicon(64)),
    ]

    for name, img in tasks:
        path = os.path.join(ASSETS, name)
        img.save(path)
        print(f'  {name}')

    print('\nDone — all assets saved to assets/')
