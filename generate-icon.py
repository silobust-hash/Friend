#!/usr/bin/env python3
"""AI Office app icon - macOS style with gradient background and clean building icon"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, os

SIZE = 1024
CENTER = SIZE // 2
BUILD_DIR = '/Users/silronomusa/Documents/0715-pro/Friends-main/build'

def lerp_color(c1, c2, t):
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))

def draw_icon():
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    pad = 40
    r = 200

    # macOS gradient background (top-left to bottom-right)
    top_color = (90, 70, 220)     # purple-blue
    bottom_color = (30, 20, 80)   # deep navy
    for y in range(pad, SIZE - pad):
        t = (y - pad) / (SIZE - 2 * pad)
        c = lerp_color(top_color, bottom_color, t)
        draw.line([(pad, y), (SIZE - pad, y)], fill=(*c, 255))

    # Mask to rounded rectangle
    mask = Image.new('L', (SIZE, SIZE), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([pad, pad, SIZE-pad, SIZE-pad], radius=r, fill=255)
    img.putalpha(mask)

    # Subtle inner border
    draw.rounded_rectangle([pad+2, pad+2, SIZE-pad-2, SIZE-pad-2], radius=r-2, fill=None, outline=(255,255,255,30), width=3)

    # --- Office building icon ---
    bx, by = CENTER, CENTER - 60  # building center
    bw, bh = 260, 340  # building size

    # Building shadow
    shadow_img = Image.new('RGBA', (SIZE, SIZE), (0,0,0,0))
    shadow_draw = ImageDraw.Draw(shadow_img)
    shadow_draw.rounded_rectangle([bx-bw//2+8, by-bh//2+12, bx+bw//2+8, by+bh//2+12], radius=20, fill=(0,0,0,80))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(radius=15))
    img = Image.alpha_composite(img, shadow_img)
    draw = ImageDraw.Draw(img)

    # Building body
    draw.rounded_rectangle([bx-bw//2, by-bh//2, bx+bw//2, by+bh//2], radius=20, fill=(240, 242, 255, 240))

    # Roof accent
    draw.rounded_rectangle([bx-bw//2, by-bh//2, bx+bw//2, by-bh//2+40], radius=20, fill=(108, 92, 231, 255))
    draw.rectangle([bx-bw//2, by-bh//2+20, bx+bw//2, by-bh//2+40], fill=(108, 92, 231, 255))

    # Windows - 3 columns x 4 rows
    win_colors = [
        (108, 92, 231),  # purple (active)
        (52, 152, 219),  # blue (active)
        (46, 204, 113),  # green (active)
        (241, 196, 15),  # yellow
        (231, 76, 60),   # red
        (149, 165, 180), # gray (inactive)
    ]

    win_w, win_h = 56, 48
    cols, rows = 3, 4
    gap_x = (bw - 60) // cols
    gap_y = (bh - 100) // rows
    start_x = bx - bw//2 + 45
    start_y = by - bh//2 + 70

    ci = 0
    for row in range(rows):
        for col in range(cols):
            wx = start_x + col * gap_x
            wy = start_y + row * gap_y
            wc = win_colors[ci % len(win_colors)]

            # Window glow
            glow_img = Image.new('RGBA', (SIZE, SIZE), (0,0,0,0))
            glow_draw = ImageDraw.Draw(glow_img)
            glow_draw.rounded_rectangle([wx-4, wy-4, wx+win_w+4, wy+win_h+4], radius=10, fill=(*wc, 40))
            glow_img = glow_img.filter(ImageFilter.GaussianBlur(radius=6))
            img = Image.alpha_composite(img, glow_img)
            draw = ImageDraw.Draw(img)

            # Window
            draw.rounded_rectangle([wx, wy, wx+win_w, wy+win_h], radius=8, fill=(*wc, 200))

            # Window shine
            draw.rounded_rectangle([wx+3, wy+3, wx+win_w//2-2, wy+win_h//2-2], radius=4, fill=(255,255,255,60))
            ci += 1

    # Door
    door_w, door_h = 60, 80
    dx = bx - door_w // 2
    dy = by + bh // 2 - door_h
    draw.rounded_rectangle([dx, dy, dx+door_w, by+bh//2], radius=12, fill=(80, 65, 180, 255))
    draw.rounded_rectangle([dx, dy, dx+door_w, dy+12], radius=12, fill=(80, 65, 180, 255))
    # Door handle
    draw.ellipse([dx+door_w-18, dy+door_h//2-4, dx+door_w-10, dy+door_h//2+4], fill=(255,255,255,180))

    # --- "AI" badge on roof ---
    badge_cx, badge_cy = bx, by - bh//2 + 20
    try:
        font_badge = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
    except:
        font_badge = ImageFont.load_default()
    draw.text((badge_cx, badge_cy), "AI", fill=(255,255,255,255), font=font_badge, anchor="mm")

    # --- 3 small character dots at bottom (people indicators) ---
    dot_y = by + bh//2 + 50
    dot_colors = [(231,76,60), (108,92,231), (46,204,113)]
    for i, dc in enumerate(dot_colors):
        dot_x = CENTER + (i - 1) * 50
        draw.ellipse([dot_x-14, dot_y-14, dot_x+14, dot_y+14], fill=(*dc, 255))
        # Small head
        draw.ellipse([dot_x-8, dot_y-12, dot_x+8, dot_y+2], fill=(255,224,189,255))
        # Body
        draw.ellipse([dot_x-12, dot_y, dot_x+12, dot_y+14], fill=(*dc, 255))

    # --- "AI Office" text at bottom ---
    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
        font_sub = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
    except:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    text_y = SIZE - pad - 120
    # Text shadow
    draw.text((CENTER+2, text_y+2), "AI Office", fill=(0,0,0,80), font=font_title, anchor="mt")
    draw.text((CENTER, text_y), "AI Office", fill=(255,255,255,255), font=font_title, anchor="mt")
    draw.text((CENTER, text_y+55), "Virtual Team", fill=(255,255,255,140), font=font_sub, anchor="mt")

    return img


def create_iconset(img):
    iconset_dir = os.path.join(BUILD_DIR, 'icon.iconset')
    os.makedirs(iconset_dir, exist_ok=True)

    sizes = [16, 32, 64, 128, 256, 512, 1024]
    for s in sizes:
        resized = img.resize((s, s), Image.LANCZOS)
        resized.save(os.path.join(iconset_dir, f'icon_{s}x{s}.png'))
        if s <= 512:
            resized2x = img.resize((s*2, s*2), Image.LANCZOS)
            resized2x.save(os.path.join(iconset_dir, f'icon_{s}x{s}@2x.png'))
    print(f"Iconset created at {iconset_dir}")


if __name__ == '__main__':
    icon = draw_icon()
    os.makedirs(BUILD_DIR, exist_ok=True)
    icon.save(os.path.join(BUILD_DIR, 'icon.png'))
    print("icon.png saved")
    create_iconset(icon)
    print("Done!")
