from PIL import Image, ImageDraw, ImageFont
import os

# Create directories
os.makedirs('/home/battletron/.openclaw/workspace/noah-kappers/output', exist_ok=True)

# Colors
BEIGE = (232, 226, 217)  # #E8E2D9
DARK_GRAY = (44, 44, 44)  # #2C2C2C
BLACK = (26, 26, 26)  # #1a1a1a
WHITE = (255, 255, 255)
LIGHT_GRAY = (200, 200, 200)

# Create front side (A4 size: 2480 x 3508 pixels at 300 DPI)
width, height = 2480, 3508

# ==================== VOORKANT ====================
front = Image.new('RGB', (width, height), BEIGE)
draw = ImageDraw.Draw(front)

# Try to load fonts, fallback to default if not available
try:
    # Title font - large serif style
    title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", 120)
except:
    title_font = ImageFont.load_default()

try:
    # Regular text
    text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)
    small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
except:
    text_font = ImageFont.load_default()
    small_font = ImageFont.load_default()

# Draw title
title_text = "NOAH KAPPERS"
bbox = draw.textbbox((0, 0), title_text, font=title_font)
text_width = bbox[2] - bbox[0]
draw.text(((width - text_width) // 2, 200), title_text, fill=BLACK, font=title_font)

# Draw photo placeholder (rounded rectangle)
photo_left = (width - 1400) // 2
photo_top = 500
photo_right = photo_left + 1400
photo_bottom = photo_top + 1000

# Draw rounded rectangle for photo
draw.rounded_rectangle([photo_left, photo_top, photo_right, photo_bottom], 
                       radius=50, fill=(212, 207, 199), outline=None)

# Photo placeholder text
photo_text = "[FOTO KAPPERSZAAK]"
bbox = draw.textbbox((0, 0), photo_text, font=text_font)
text_width = bbox[2] - bbox[0]
draw.text(((width - text_width) // 2, photo_top + 450), photo_text, fill=(100, 100, 100), font=text_font)

# Draw QR section
qr_y = 1800
qr_size = 400

# QR Label
qr_label_lines = ["BOEK JOUW", "AFSPRAAK", "VANDAAG"]
line_height = 60
start_y = qr_y
for i, line in enumerate(qr_label_lines):
    bbox = draw.textbbox((0, 0), line, font=text_font)
    text_width = bbox[2] - bbox[0]
    draw.text(((width - text_width) // 2, start_y + i * line_height), 
              line, fill=BLACK, font=text_font)

# QR Code placeholder
qr_left = (width - qr_size) // 2
qr_top = start_y + 200
draw.rectangle([qr_left, qr_top, qr_left + qr_size, qr_top + qr_size], 
               fill=DARK_GRAY, outline=None)

# QR inner white box
draw.rectangle([qr_left + 20, qr_top + 20, qr_left + qr_size - 20, qr_top + qr_size - 20], 
               fill=WHITE, outline=None)

# QR text
qr_text = "QR CODE"
bbox = draw.textbbox((0, 0), qr_text, font=text_font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
draw.text(((width - text_width) // 2, qr_top + qr_size//2 - text_height//2), 
          qr_text, fill=BLACK, font=text_font)

# Save front
front.save('/home/battletron/.openclaw/workspace/noah-kappers/output/noah-kappers-voorkant.png', 'PNG')
print("✅ Voorkant opgeslagen")

# ==================== ACHTERKANT ====================
back = Image.new('RGB', (width, height), BEIGE)
draw = ImageDraw.Draw(back)

# Title
try:
    back_title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", 100)
    back_sub_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 80)
except:
    back_title_font = ImageFont.load_default()
    back_sub_font = ImageFont.load_default()

# Main title
title1 = "NOAH KAPPERS"
bbox = draw.textbbox((0, 0), title1, font=back_title_font)
text_width = bbox[2] - bbox[0]
draw.text(((width - text_width) // 2, 150), title1, fill=BLACK, font=back_title_font)

# Subtitle
title2 = "DIENSTEN"
bbox = draw.textbbox((0, 0), title2, font=back_sub_font)
text_width = bbox[2] - bbox[0]
draw.text(((width - text_width) // 2, 280), title2, fill=BLACK, font=back_sub_font)

# Divider line
line_y = 420
line_width = 600
line_left = (width - line_width) // 2
draw.line([(line_left, line_y), (line_left + line_width, line_y)], fill=BLACK, width=4)

# Opening hours section (NEW - as requested)
open_y = 480
try:
    open_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 42)
    open_val_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
except:
    open_font = ImageFont.load_default()
    open_val_font = ImageFont.load_default()

# Opening hours title
open_title = "OPENINGSTIJDEN"
bbox = draw.textbbox((0, 0), open_title, font=open_font)
text_width = bbox[2] - bbox[0]
draw.text(((width - text_width) // 2, open_y), open_title, fill=BLACK, font=open_font)

# Opening hours
hours = [
    ("Maandag", "Gesloten"),
    ("Dinsdag", "09:00 - 18:00"),
    ("Woensdag", "09:00 - 18:00"),
    ("Donderdag", "09:00 - 20:00"),
    ("Vrijdag", "09:00 - 18:00"),
    ("Zaterdag", "09:00 - 17:00"),
    ("Zondag", "Gesloten"),
]

hours_y = open_y + 80
hours_left = 700
for day, time in hours:
    draw.text((hours_left, hours_y), day, fill=BLACK, font=open_val_font)
    bbox = draw.textbbox((0, 0), time, font=open_val_font)
    time_width = bbox[2] - bbox[0]
    draw.text((width - hours_left - time_width, hours_y), time, fill=BLACK, font=open_val_font)
    hours_y += 60

# QR Code top right
qr_right_size = 300
qr_right_x = width - 400
qr_right_y = 150
draw.rectangle([qr_right_x, qr_right_y, qr_right_x + qr_right_size, qr_right_y + qr_right_size], 
               fill=DARK_GRAY, outline=None)
draw.rectangle([qr_right_x + 15, qr_right_y + 15, qr_right_x + qr_right_size - 15, qr_right_y + qr_right_size - 15], 
               fill=WHITE, outline=None)

# QR label above
qr_label = "BOEK JOUW"
qr_label2 = "AFSPRAAK VANDAAG"
bbox = draw.textbbox((0, 0), qr_label, font=small_font)
text_width = bbox[2] - bbox[0]
draw.text((qr_right_x + (qr_right_size - text_width)//2, qr_right_y - 80), qr_label, fill=BLACK, font=small_font)
bbox = draw.textbbox((0, 0), qr_label2, font=small_font)
text_width = bbox[2] - bbox[0]
draw.text((qr_right_x + (qr_right_size - text_width)//2, qr_right_y - 40), qr_label2, fill=BLACK, font=small_font)

# Services section - now below opening hours
services_y = hours_y + 100
services = [
    ("Knippen", "€ 25,00"),
    ("Knippen & Stylen", "€ 32,50"),
    ("Kleuren", "Vanaf € 45,00"),
    ("Highlights", "Vanaf € 55,00"),
    ("Baard Trimmen", "€ 15,00"),
    ("Wassen & Föhnen", "€ 18,00"),
]

try:
    service_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)
    price_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
except:
    service_font = ImageFont.load_default()
    price_font = ImageFont.load_default()

service_left = 500
for service, price in services:
    # Draw line
    line_y = services_y + 50
    draw.line([(service_left, line_y), (width - service_left, line_y)], fill=(180, 180, 180), width=2)
    
    # Service name
    draw.text((service_left, services_y - 10), service, fill=BLACK, font=service_font)
    
    # Price (right aligned)
    bbox = draw.textbbox((0, 0), price, font=price_font)
    price_width = bbox[2] - bbox[0]
    draw.text((width - service_left - price_width, services_y - 10), price, fill=BLACK, font=price_font)
    
    services_y += 100

# Footer (dark section)
footer_height = 400
footer_top = height - footer_height
draw.rectangle([0, footer_top, width, height], fill=DARK_GRAY)

# Footer text
try:
    footer_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
except:
    footer_font = ImageFont.load_default()

footer_items = [
    "🌐  www.noahkappers.nl",
    "📍  Theo Dobbestraat 189, 6663 RJ Lent",
    "📞  06 84812004"
]

footer_y = footer_top + 100
for item in footer_items:
    draw.text((150, footer_y), item, fill=BEIGE, font=footer_font)
    footer_y += 80

# Save back
back.save('/home/battletron/.openclaw/workspace/noah-kappers/output/noah-kappers-achterkant.png', 'PNG')
print("✅ Achterkant opgeslagen")

# Create combined preview (both sides side by side for viewing)
preview_width = width * 2
preview_height = height
preview = Image.new('RGB', (preview_width, preview_height), WHITE)
preview.paste(front, (0, 0))
preview.paste(back, (width, 0))
preview.save('/home/battletron/.openclaw/workspace/noah-kappers/output/noah-kappers-preview.png', 'PNG')
print("✅ Preview opgeslagen (beide kanten naast elkaar)")

print("\n📁 Bestanden opgeslagen in: /home/battletron/.openclaw/workspace/noah-kappers/output/")
print("   - noah-kappers-voorkant.png")
print("   - noah-kappers-achterkant.png")
print("   - noah-kappers-preview.png")
