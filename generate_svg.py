import urllib.request
import base64
import os
import ssl

# Ignore SSL verification if needed
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

contributors = [
    {"user": "Varunshiyam", "name": "Varun Shiyam", "tag": "PROJECT CREATOR", "color": "#FF6B00", "badge": "👑 Maintainer"},
    {"user": "Siddh2024", "name": "Siddh Sharma", "tag": "PRICE & CURRENCY", "color": "#22c55e", "badge": "⭐ Core Contributor"},
    {"user": "PrishaJain64", "name": "Prisha Jain", "tag": "COUPON SYSTEM", "color": "#ec4899", "badge": "⭐ GSSoC'26"},
    {"user": "anshul23102", "name": "Anshul", "tag": "API SECURITY", "color": "#ef4444", "badge": "🛡️ Security"},
    {"user": "sheeeuWu", "name": "Shefali", "tag": "TABS & ORDER UI", "color": "#8b5cf6", "badge": "🎨 Frontend"},
    {"user": "Sharanyaaa08", "name": "Sharanya", "tag": "DISCOVER FILTER", "color": "#3b82f6", "badge": "⭐ GSSoC'26"},
    {"user": "akshatsinghai6682-sketch", "name": "Akshat Singhai", "tag": "EMPTY CART UX", "color": "#f59e0b", "badge": "⭐ GSSoC'26"},
    {"user": "saam-07", "name": "Saamya Narayan", "tag": "HELP MODAL", "color": "#8b5cf6", "badge": "⭐ GSSoC'26"},
    {"user": "shalinchristian", "name": "Shalin Christian", "tag": "ACCESSIBILITY", "color": "#10b981", "badge": "⭐ GSSoC'26"},
    {"user": "ayushyadav0707", "name": "Ayush Yadav", "tag": "PWA SUPPORT", "color": "#6366f1", "badge": "📱 PWA"},
    {"user": "oshin-30", "name": "Oshin", "tag": "EDIT PROFILE", "color": "#22c55e", "badge": "⭐ GSSoC'26"},
    {"user": "krishattri01", "name": "Krish Attri", "tag": "SKELETON UI", "color": "#f59e0b", "badge": "⭐ GSSoC'26"},
    {"user": "aryankalra404", "name": "Aryan Kalra", "tag": "PAYMENT FIX", "color": "#ef4444", "badge": "💳 Payments"},
    {"user": "Vidheendu", "name": "Vidheendu", "tag": "ORDER ANALYTICS", "color": "#8b5cf6", "badge": "📊 Analytics"},
    {"user": "Varshinigurram", "name": "Varshini", "tag": "THEME TOGGLE", "color": "#f59e0b", "badge": "🌓 Theme"},
    {"user": "yashvi-3106", "name": "Yashvi", "tag": "DISCOVER V2", "color": "#22c55e", "badge": "⭐ GSSoC'26"},
    {"user": "Priyanshu-ai902", "name": "Priyanshu", "tag": "ADDRESS MGMT", "color": "#3b82f6", "badge": "⭐ GSSoC'26"},
    {"user": "parasmani-dev", "name": "Parasmani", "tag": "CORE FEATURES", "color": "#22c55e", "badge": "⭐ GSSoC'26"},
    {"user": "yousuf-26-07", "name": "Mohamed Yousuf", "tag": "SUPPORT & FAQ", "color": "#3b82f6", "badge": "🆘 Support"},
    {"user": "Jeshika311", "name": "Jeshika", "tag": "CONTACT UI", "color": "#8b5cf6", "badge": "⭐ GSSoC'26"},
    {"user": "sonal-jakhar", "name": "Sonal Jakhar", "tag": "DOWNLOAD BTN", "color": "#f59e0b", "badge": "⭐ GSSoC'26"},
    {"user": "Akshita-2307", "name": "Akshita", "tag": "ALT TEXT FIX", "color": "#22c55e", "badge": "⭐ GSSoC'26"},
    {"user": "RiddhiBose", "name": "Riddhi Bose", "tag": "MENU FIX", "color": "#ef4444", "badge": "⭐ GSSoC'26"},
    {"user": "Biraj-Sarkar", "name": "Biraj Sarkar", "tag": "SEARCH FILTER", "color": "#3b82f6", "badge": "⭐ GSSoC'26"},
    {"user": "puvvalasanjanagayathri-eng", "name": "Sanjana", "tag": "VEG FILTER", "color": "#22c55e", "badge": "⭐ GSSoC'26"},
    {"user": "shanupriya0311", "name": "Shanupriya", "tag": "PAYMENT FLOW", "color": "#6366f1", "badge": "💳 Payments"},
    {"user": "shivv2430", "name": "Shiv", "tag": "BRAND LOGO", "color": "#f59e0b", "badge": "🎨 Design"},
    {"user": "shineetejol9", "name": "Shinee Tejol", "tag": "CONTRIBUTIONS", "color": "#22c55e", "badge": "⭐ GSSoC'26"},
    {"user": "NiranjanRSoorej06", "name": "Niranjan", "tag": "TITLEBAR UI", "color": "#3b82f6", "badge": "⭐ GSSoC'26"},
    {"user": "Dippp10-ally", "name": "Dippp", "tag": "DOCUMENTATION", "color": "#3b82f6", "badge": "📖 Docs"},
    {"user": "Aarya1402", "name": "Aarya", "tag": "TEST COVERAGE", "color": "#ef4444", "badge": "🧪 Tests"},
    {"user": "Mohit-001-hash", "name": "Mohit", "tag": "SFDX PREREQS", "color": "#22c55e", "badge": "☁️ Salesforce"},
    {"user": "lakshiii08", "name": "Lakshi", "tag": "GSSOC DEV", "color": "#FF6600", "badge": "⭐ GSSoC'26"}
]

print(f"Fetching avatars for {len(contributors)} contributors...")
avatars = {}

# Fallback 1x1 png in case of fetch failure
fallback_png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

for c in contributors:
    username = c["user"]
    url = f"https://github.com/{username}.png?size=140"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
            data = response.read()
            avatars[username] = base64.b64encode(data).decode('utf-8')
            print(f"✓ Fetched avatar for {username} ({len(data)} bytes)")
    except Exception as e:
        print(f"✗ Failed to fetch avatar for {username}: {e}")
        avatars[username] = fallback_png

card_width = 300
card_height = 420
card_gap = 24
total_unit = card_width + card_gap
num_cards = len(contributors)
total_scroll_dist = num_cards * total_unit

# Duration: ~4 seconds per card for smooth sliding
anim_duration = max(40, num_cards * 3.5)

# Duplicate the list once for seamless looping
all_cards = contributors + contributors

cards_svg = []
for i, c in enumerate(all_cards):
    x = i * total_unit
    username = c["user"]
    display_name = c["name"]
    tag = c["tag"]
    color = c["color"]
    badge = c["badge"]
    b64_img = avatars.get(username, fallback_png)
    
    # Clip id
    clip_id = f"clip-{i}"
    
    card = f"""
    <!-- Card {i}: {username} -->
    <g transform="translate({x}, 20)">
      <defs>
        <clipPath id="{clip_id}">
          <circle cx="150" cy="115" r="62"/>
        </clipPath>
      </defs>
      
      <!-- Card background -->
      <rect x="0" y="0" width="{card_width}" height="{card_height}" rx="24" ry="24" fill="url(#card-grad)" stroke="#1e293b" stroke-width="1.5"/>
      <rect x="0" y="0" width="{card_width}" height="{card_height}" rx="24" ry="24" fill="none" stroke="url(#border-grad)" stroke-width="1" opacity="0.6"/>
      
      <!-- Glow accent behind avatar -->
      <circle cx="150" cy="115" r="68" fill="{color}" opacity="0.18" filter="url(#blur-glow)"/>
      <circle cx="150" cy="115" r="65" fill="none" stroke="{color}" stroke-width="3.5"/>
      
      <!-- Avatar -->
      <image href="data:image/png;base64,{b64_img}" x="88" y="53" width="124" height="124" clip-path="url(#{clip_id})"/>
      
      <!-- Made with Love / Badge Tag at top right -->
      <g transform="translate(18, 20)">
        <rect x="0" y="0" width="110" height="22" rx="11" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="55" y="15" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" text-anchor="middle">Made with ❤️</text>
      </g>
      
      <!-- Role / Type Badge -->
      <g transform="translate(180, 20)">
        <rect x="0" y="0" width="102" height="22" rx="11" fill="#0f172a" stroke="{color}" stroke-width="1" opacity="0.9"/>
        <text x="51" y="15" fill="{color}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10.5" font-weight="700" text-anchor="middle">{badge}</text>
      </g>
      
      <!-- Contributor Name -->
      <text x="150" y="218" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="19" font-weight="700" text-anchor="middle">{display_name}</text>
      
      <!-- GitHub Username -->
      <text x="150" y="244" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" text-anchor="middle">@{username}</text>
      
      <!-- Divider accent line -->
      <line x1="30" y1="268" x2="270" y2="268" stroke="{color}" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
      
      <!-- Contribution Label -->
      <text x="150" y="302" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" text-anchor="middle" letter-spacing="1">CONTRIBUTED TO</text>
      
      <!-- Contribution 1-2 Word Tag Pill -->
      <g transform="translate(30, 320)">
        <rect x="0" y="0" width="240" height="38" rx="19" fill="{color}" opacity="0.15" stroke="{color}" stroke-width="1.5"/>
        <text x="120" y="24" fill="{color}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="800" text-anchor="middle" letter-spacing="0.5">{tag}</text>
      </g>
      
      <!-- Footer Note -->
      <text x="150" y="394" fill="#475569" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="500" text-anchor="middle">QuickPlate Contributor 🚀</text>
    </g>
    """
    cards_svg.append(card)

svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 460" width="100%" height="460">
  <defs>
    <!-- Linear Gradients for Cards -->
    <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1120" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    
    <linearGradient id="border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>
    
    <filter id="blur-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" />
    </filter>
  </defs>

  <style>
    @keyframes rollCarousel {{
      0% {{
        transform: translateX(0px);
      }}
      100% {{
        transform: translateX(-{total_scroll_dist}px);
      }}
    }}
    
    .carousel-track {{
      animation: rollCarousel {anim_duration}s linear infinite;
    }}
    
    .carousel-track:hover {{
      animation-play-state: paused;
    }}
  </style>

  <!-- Rolling Carousel Group -->
  <g class="carousel-track">
    {''.join(cards_svg)}
  </g>
</svg>
"""

with open("docs/contributors.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

print(f"🎉 Successfully generated docs/contributors.svg ({len(svg_content)} bytes)")
