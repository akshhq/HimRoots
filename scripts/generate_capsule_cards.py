import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops

PUBLIC_DIR = r"d:\Clg\Client Work\HimRoots\public\images"
FONTS_DIR = r"C:\Windows\Fonts"

font_serif_bold_xl = ImageFont.truetype(os.path.join(FONTS_DIR, "georgiab.ttf"), 40)
font_serif_bold_large = ImageFont.truetype(os.path.join(FONTS_DIR, "georgiab.ttf"), 34)
font_serif_bold_med = ImageFont.truetype(os.path.join(FONTS_DIR, "georgiab.ttf"), 26)
font_serif_bold_sm = ImageFont.truetype(os.path.join(FONTS_DIR, "georgiab.ttf"), 20)

font_sans_bold = ImageFont.truetype(os.path.join(FONTS_DIR, "arialbd.ttf"), 20)
font_sans_bold_sm = ImageFont.truetype(os.path.join(FONTS_DIR, "arialbd.ttf"), 15)
font_sans_bold_xs = ImageFont.truetype(os.path.join(FONTS_DIR, "arialbd.ttf"), 12)
font_sans_reg = ImageFont.truetype(os.path.join(FONTS_DIR, "arial.ttf"), 16)
font_sans_reg_sm = ImageFont.truetype(os.path.join(FONTS_DIR, "arial.ttf"), 14)
font_sans_reg_xs = ImageFont.truetype(os.path.join(FONTS_DIR, "arial.ttf"), 12)

GOLD_LIGHT = (245, 215, 127)
GOLD_PRIMARY = (229, 169, 60)
GOLD_DARK = (184, 134, 11)
GOLD_MUTED = (160, 130, 80)
TEXT_WHITE = (255, 255, 255)
TEXT_LIGHT_GRAY = (225, 225, 230)
TEXT_GRAY = (160, 160, 165)

def get_base_slate_background():
    # Create pure luxury slate dark background (14, 14, 16) with subtle radial gradient
    bg = Image.new("RGB", (1024, 1024), (12, 12, 14))
    draw = ImageDraw.Draw(bg)
    
    # Subtle dark slate radial texture
    for r in range(500, 0, -20):
        intensity = int(14 + (1 - r / 500) * 8)
        draw.ellipse([512 - r, 512 - r, 512 + r, 512 + r], fill=(intensity, intensity, intensity + 3))
        
    # Luxury gold border frame
    draw.rectangle([28, 28, 996, 996], outline=GOLD_PRIMARY, width=2)
    draw.rectangle([34, 34, 990, 990], outline=(55, 48, 36), width=1)
    
    # Corner filigree accents
    for x, y in [(28, 28), (996, 28), (28, 996), (996, 996)]:
        draw.rectangle([x-5, y-5, x+5, y+5], fill=GOLD_LIGHT, outline=GOLD_DARK)
        
    return bg

def draw_checkmark(draw, x, y, size=16, color=GOLD_PRIMARY):
    # Draw an elegant checkmark
    draw.line([x, y + size * 0.5, x + size * 0.35, y + size * 0.85], fill=color, width=2)
    draw.line([x + size * 0.35, y + size * 0.85, x + size, y + size * 0.15], fill=color, width=2)

def create_daily_ritual_card():
    img = get_base_slate_background()
    draw = ImageDraw.Draw(img)
    
    # --- Top Header ---
    badge_text = "DAILY WELLNESS RITUAL"
    draw.text((512, 60), badge_text, fill=GOLD_PRIMARY, font=font_sans_bold_sm, anchor="mm")
    
    main_title = "DAILY USAGE & DOSAGE GUIDE"
    draw.text((512, 100), main_title, fill=GOLD_LIGHT, font=font_serif_bold_xl, anchor="mm")
    
    sub_title = "Himroots Sea Buckthorn Softgels Protocol"
    draw.text((512, 138), sub_title, fill=TEXT_LIGHT_GRAY, font=font_sans_reg, anchor="mm")
    
    # Subtle gold line divider under header
    draw.line([300, 160, 724, 160], fill=GOLD_MUTED, width=1)
    draw.ellipse([508, 157, 516, 163], fill=GOLD_PRIMARY)
    
    # Load softgel image if available
    softgel_img = None
    if os.path.exists(os.path.join(PUBLIC_DIR, "temp_softgel.png")):
        softgel_img = Image.open(os.path.join(PUBLIC_DIR, "temp_softgel.png")).convert("RGBA")
    
    # --- 3 Step Cards ---
    steps_data = [
        {
            "num": "01",
            "title": "1 TO 2 SOFTGELS DAILY",
            "subtitle": "Take With Meals (Breakfast or Lunch)",
            "desc": "Take 1 to 2 vegetarian softgels daily with food. Fat-soluble Omegas 3, 6, 7 & 9 are absorbed up to 3x more effectively when taken alongside healthy dietary lipids.",
            "y": 190
        },
        {
            "num": "02",
            "title": "SWALLOW WITH WATER",
            "subtitle": "Full Glass of Room Temperature Water",
            "desc": "Swallow with a full 200ml glass of water. The pure plant-cellulose shell ensures smooth gastric transit with zero fishy burps, reflux, or stomach irritation.",
            "y": 430
        },
        {
            "num": "03",
            "title": "60-90 DAYS CONSISTENCY",
            "subtitle": "Cumulative Dermal & Mucosal Hydration",
            "desc": "Cellular restoration is cumulative: Day 1-15 supports tear-film & oral hydration, Day 15-45 enhances skin barrier lipid levels, Day 60+ promotes deep vitality.",
            "y": 670
        }
    ]
    
    for i, step in enumerate(steps_data):
        y_top = step["y"]
        y_bot = y_top + 210
        
        # Step card container with subtle rounded border
        card_rect = [65, y_top, 959, y_bot]
        draw.rounded_rectangle(card_rect, radius=16, fill=(18, 18, 22), outline=(50, 45, 35), width=1)
        
        # Gold highlight bar on left
        draw.rounded_rectangle([65, y_top, 73, y_bot], radius=4, fill=GOLD_PRIMARY)
        
        # Step Number Badge
        draw.ellipse([95, y_top + 30, 165, y_top + 100], fill=(28, 24, 16), outline=GOLD_PRIMARY, width=2)
        draw.text((130, y_top + 65), step["num"], fill=GOLD_LIGHT, font=font_serif_bold_med, anchor="mm")
        draw.text((130, y_top + 115), "STEP", fill=GOLD_MUTED, font=font_sans_bold_xs, anchor="mm")
        
        # Step Title & Subtitle
        draw.text((195, y_top + 38), step["title"], fill=GOLD_LIGHT, font=font_serif_bold_med)
        draw.text((195, y_top + 74), step["subtitle"], fill=GOLD_PRIMARY, font=font_sans_bold_sm)
        
        # Description text
        words = step["desc"].split(" ")
        lines = []
        cur_line = []
        for word in words:
            cur_line.append(word)
            test_str = " ".join(cur_line)
            bbox = draw.textbbox((0, 0), test_str, font=font_sans_reg_sm)
            if bbox[2] - bbox[0] > 600:
                cur_line.pop()
                lines.append(" ".join(cur_line))
                cur_line = [word]
        if cur_line:
            lines.append(" ".join(cur_line))
            
        cur_y = y_top + 110
        for line in lines:
            draw.text((195, cur_y), line, fill=TEXT_LIGHT_GRAY, font=font_sans_reg_sm)
            cur_y += 22
            
        # Add visual icon on right side of card
        if i == 0 and softgel_img:
            # Softgel with soft feathered oval mask
            sg = softgel_img.resize((70, 115), Image.Resampling.LANCZOS)
            img.paste(sg, (840, y_top + 45), sg)
        elif i == 1:
            # Water droplet symbol
            draw.ellipse([835, y_top + 50, 915, y_top + 130], fill=(22, 26, 32), outline=GOLD_PRIMARY, width=2)
            draw.text((875, y_top + 80), "H2O", fill=GOLD_LIGHT, font=font_sans_bold, anchor="mm")
            draw.text((875, y_top + 102), "200ml", fill=GOLD_MUTED, font=font_sans_bold_xs, anchor="mm")
        elif i == 2:
            # 60-90 Days badge
            draw.ellipse([835, y_top + 50, 915, y_top + 130], fill=(28, 24, 16), outline=GOLD_PRIMARY, width=2)
            draw.text((875, y_top + 80), "90", fill=GOLD_LIGHT, font=font_serif_bold_med, anchor="mm")
            draw.text((875, y_top + 104), "DAYS", fill=GOLD_PRIMARY, font=font_sans_bold_xs, anchor="mm")

    # --- Bottom Footer Banner ---
    draw.rounded_rectangle([65, 905, 959, 965], radius=12, fill=(22, 20, 14), outline=GOLD_MUTED, width=1)
    footer_text = "100% Plant Cellulose Softgel • Zero Gelatin • Zero Fillers • cGMP Certified & Hexane Free"
    draw.text((512, 935), footer_text, fill=GOLD_LIGHT, font=font_sans_bold_sm, anchor="mm")
    
    target_path = os.path.join(PUBLIC_DIR, "capsules-daily-ritual.jpg")
    img.save(target_path, quality=95)
    print("Saved:", target_path)

def create_pack2_bundle_card():
    img = get_base_slate_background()
    
    # Load bottle image
    bottle_orig = Image.open(os.path.join(PUBLIC_DIR, "himroots-sea-buckthorn-capsules.jpg")).convert("RGBA")
    
    # In himroots-sea-buckthorn-capsules, bottle is roughly x: 220 to 804, y: 140 to 920
    bw, bh = bottle_orig.size
    crop_box = (int(bw*0.22), int(bh*0.14), int(bw*0.78), int(bh*0.88))
    bottle_crop = bottle_orig.crop(crop_box)
    
    # Create smooth feathered alpha mask for the bottle so its edges softly melt into the background
    cw, ch = bottle_crop.size
    mask = Image.new("L", (cw, ch), 255)
    mask_draw = ImageDraw.Draw(mask)
    
    # Feather horizontal and vertical edges with wide gradient
    feather_x = 45
    feather_y = 35
    for x in range(cw):
        for y in range(ch):
            factor = 1.0
            if x < feather_x:
                factor *= (x / feather_x)
            elif x > cw - feather_x:
                factor *= ((cw - x) / feather_x)
            if y < feather_y:
                factor *= (y / feather_y)
            elif y > ch - feather_y:
                factor *= ((ch - y) / feather_y)
            if factor < 1.0:
                mask.putpixel((x, y), int(255 * factor))
                
    mask = mask.filter(ImageFilter.GaussianBlur(5))
    bottle_crop.putalpha(mask)
    
    # Center ambient golden radial glow
    glow = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    for r in range(380, 40, -10):
        alpha = int(45 * (1 - r/380))
        glow_draw.ellipse([512 - r, 460 - r, 512 + r, 460 + r], fill=(229, 169, 60, alpha))
    
    img_rgba = img.convert("RGBA")
    img_rgba = Image.alpha_composite(img_rgba, glow)
    
    # Resize bottles to twin luxury duo pack
    bottle_w, bottle_h = 340, 450
    b_left = bottle_crop.resize((bottle_w, bottle_h), Image.Resampling.LANCZOS)
    b_right = bottle_crop.resize((bottle_w, bottle_h), Image.Resampling.LANCZOS)
    
    # Paste twin bottles side by side proudly
    img_rgba.paste(b_left, (170, 245), b_left)
    img_rgba.paste(b_right, (514, 245), b_right)
    
    img = img_rgba.convert("RGB")
    draw = ImageDraw.Draw(img)
    
    # --- Top Header ---
    badge_text = "VALUE BUNDLE COURSE"
    draw.text((512, 60), badge_text, fill=GOLD_PRIMARY, font=font_sans_bold_sm, anchor="mm")
    
    main_title = "PACK OF 2 VALUE BUNDLE"
    draw.text((512, 100), main_title, fill=GOLD_LIGHT, font=font_serif_bold_xl, anchor="mm")
    
    sub_title = "2 x 60 Softgels (120 Capsules) — Complete 60-Day Wellness Course"
    draw.text((512, 138), sub_title, fill=TEXT_LIGHT_GRAY, font=font_sans_reg, anchor="mm")
    
    # Divider line
    draw.line([300, 160, 724, 160], fill=GOLD_MUTED, width=1)
    draw.ellipse([508, 157, 516, 163], fill=GOLD_PRIMARY)
    
    # Floating Badge: SAVE 28% OFF
    draw.rounded_rectangle([730, 215, 920, 275], radius=14, fill=(160, 30, 20), outline=GOLD_LIGHT, width=2)
    draw.text((825, 236), "SAVE 28%", fill=TEXT_WHITE, font=font_sans_bold, anchor="mm")
    draw.text((825, 258), "SPECIAL BUNDLE", fill=GOLD_LIGHT, font=font_sans_bold_xs, anchor="mm")
    
    # Feature Badge on left: 120 CAPSULES
    draw.rounded_rectangle([100, 215, 290, 275], radius=14, fill=(22, 20, 14), outline=GOLD_PRIMARY, width=2)
    draw.text((195, 236), "120 SOFTGELS", fill=GOLD_LIGHT, font=font_sans_bold, anchor="mm")
    draw.text((195, 258), "60-DAY COURSE", fill=TEXT_LIGHT_GRAY, font=font_sans_bold_xs, anchor="mm")
    
    # --- Bottom Pricing & Feature Card ---
    card_rect = [65, 715, 959, 955]
    draw.rounded_rectangle(card_rect, radius=18, fill=(16, 16, 20), outline=GOLD_PRIMARY, width=2)
    
    # Left Side: Features with custom checkmarks
    features = [
        "2 x 60 Amber Glass Apothecary Bottles (120 Softgels)",
        "Full 60 to 90 Day Daily Ritual Recommended Course",
        "Maximum Skin Hydration, Mucosal Relief & Cellular Omega-7",
        "Free Express Nationwide Delivery Included"
    ]
    cur_y = 745
    for feat in features:
        draw_checkmark(draw, 95, cur_y + 2, size=14, color=GOLD_PRIMARY)
        draw.text((120, cur_y), feat, fill=TEXT_LIGHT_GRAY, font=font_sans_reg_sm)
        cur_y += 30
        
    # Divider in card
    draw.line([640, 735, 640, 935], fill=(55, 48, 36), width=1)
    
    # Right Side: Price block
    draw.text((795, 755), "SPECIAL BUNDLE PRICE", fill=GOLD_MUTED, font=font_sans_bold_xs, anchor="mm")
    draw.text((795, 805), "₹2,158", fill=GOLD_LIGHT, font=ImageFont.truetype(os.path.join(FONTS_DIR, "georgiab.ttf"), 48), anchor="mm")
    
    # Strikethrough original price
    strike_text = "₹2,998"
    draw.text((750, 855), strike_text, fill=TEXT_GRAY, font=font_sans_bold, anchor="mm")
    bbox = draw.textbbox((750, 855), strike_text, font=font_sans_bold, anchor="mm")
    draw.line([bbox[0], (bbox[1]+bbox[3])//2, bbox[2], (bbox[1]+bbox[3])//2], fill=(200, 80, 80), width=2)
    
    # Save text
    draw.text((830, 855), "SAVE ₹840", fill=(100, 220, 120), font=font_sans_bold_sm, anchor="mm")
    
    # Guarantee pill
    draw.rounded_rectangle([680, 885, 910, 925], radius=8, fill=(30, 26, 18), outline=GOLD_MUTED, width=1)
    draw.text((795, 905), "BEST VALUE SELECTION", fill=GOLD_PRIMARY, font=font_sans_bold_xs, anchor="mm")

    target_path = os.path.join(PUBLIC_DIR, "capsules-pack2-bundle.jpg")
    img.save(target_path, quality=95)
    print("Saved:", target_path)

if __name__ == "__main__":
    create_daily_ritual_card()
    create_pack2_bundle_card()
