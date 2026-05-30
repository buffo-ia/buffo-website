from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG    = (13, 14, 16)
GREEN = (22, 182, 107)
WHITE = (227, 226, 230)
GRAY  = (140, 142, 148)
PAD   = 80

img  = Image.new('RGB', (W, H), BG)
draw = ImageDraw.Draw(img)

# ── Dot grid ───────────────────────────────────────────────────────────────────
DOT_STEP = 28
DOT_R    = 1
DOT_COL  = (26, 28, 32)
for x in range(0, W + DOT_STEP, DOT_STEP):
    for y in range(0, H + DOT_STEP, DOT_STEP):
        draw.ellipse([x-DOT_R, y-DOT_R, x+DOT_R, y+DOT_R], fill=DOT_COL)

# ── Logo con Atomo ─────────────────────────────────────────────────────────────
LOGO = r'C:\Users\siesp\OneDrive\Claude\Buffo Consulting\Pagina web\BUFFO IA logo con Atomo transparente .PNG'
try:
    logo = Image.open(LOGO).convert('RGBA')
    lh = 44
    lw = int(logo.width * lh / logo.height)
    logo = logo.resize((lw, lh), Image.LANCZOS)
    img.paste(logo, (PAD, 38), logo)
except Exception as e:
    print(f'Logo error: {e}')

# ── Fuentes ────────────────────────────────────────────────────────────────────
try:
    f_badge = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 13)
    f_xl    = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 68)
    f_sub   = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf',  25)
except:
    f_badge = f_xl = f_sub = ImageFont.load_default()

# ── Badge "• ESTRATEGIA BASADA EN INTELIGENCIA ARTIFICIAL" ────────────────────
badge_txt = '  \u2022  ESTRATEGIA BASADA EN INTELIGENCIA ARTIFICIAL  '
bb = draw.textbbox((0, 0), badge_txt, font=f_badge)
bw = bb[2] - bb[0] + 2
bh = 30
bx, by = PAD, 104
draw.rounded_rectangle([bx, by, bx+bw, by+bh], radius=4,
                        fill=(14, 40, 26), outline=(22, 100, 60), width=1)
draw.text((bx + 1, by + 8), badge_txt, font=f_badge, fill=GREEN)

# ── Headline ───────────────────────────────────────────────────────────────────
y1 = 158
draw.text((PAD, y1), 'Tus datos ya hablan.', font=f_xl, fill=WHITE)

y2 = y1 + 78
draw.text((PAD, y2), 'Buffo IA', font=f_xl, fill=GREEN)
bb2 = draw.textbbox((PAD, y2), 'Buffo IA ', font=f_xl)
draw.text((bb2[2], y2), 'te dice qu\u00e9 hacer', font=f_xl, fill=WHITE)

y3 = y2 + 78
draw.text((PAD, y3), 'con ellos.', font=f_xl, fill=WHITE)

# ── Subtitulo ──────────────────────────────────────────────────────────────────
sub1 = 'Consultora especializada en modelamiento de datos, dashboards ejecutivos,'
sub2 = 'automatizaci\u00f3n de procesos e inteligencia artificial aplicada a la gesti\u00f3n.'
ys = y3 + 80
draw.text((PAD, ys),      sub1, font=f_sub, fill=GRAY)
draw.text((PAD, ys + 34), sub2, font=f_sub, fill=GRAY)

# ── Guardar ────────────────────────────────────────────────────────────────────
out = r'C:\Dev\buffo-website\og-image.png'
img.save(out, 'PNG', optimize=True)
print(f'OK -> {out}  ({W}x{H}px)')
