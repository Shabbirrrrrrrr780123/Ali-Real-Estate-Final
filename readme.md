# Zakir's Realty Website

**Premium Real Estate Website — Indore, India**

---

## 📁 Folder Structure

```
zakirs-realty/
│
├── index.html                  ← Home Page (Hero + Properties + Testimonials)
│
├── css/
│   └── style.css               ← Complete Design System & All Styles
│
├── js/
│   └── main.js                 ← Animations, Particle Canvas, Form Logic, Filters
│
├── images/
│   └── favicon.svg             ← Brand favicon (replace with your logo)
│
└── pages/
    ├── properties.html         ← All Properties + Filter (Budget / Location / Type)
    ├── about.html              ← About Us + Stats + Trust Building
    ├── contact.html            ← Lead Form + WhatsApp + Map
    ├── book-visit.html         ← Site Visit Booking + Date/Time Picker
    ├── investment.html         ← Investment Guide + ROI Zones
    ├── testimonials.html       ← Client Reviews
    └── blog.html               ← Insights / SEO Blog Articles
```

---

## 🚀 How to Use

1. **Open locally**: Just open `index.html` in your browser — no server needed
2. **Deploy**: Upload the entire folder to any web host (Hostinger, GoDaddy, Netlify, etc.)
3. **Custom domain**: Point your domain to the folder root

---

## 🤖 n8n Automation Setup

In `js/main.js`, find this line:
```javascript
const WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/zakirs-realty-lead';
```

Replace it with your actual n8n webhook URL.

**Data sent to n8n on form submit:**
```json
{
  "name": "Rahul Verma",
  "phone": "+91 98765 43210",
  "budget": "₹35L – ₹50L",
  "location": "Bijalpur (Rau)",
  "type": "2 BHK Flat",
  "message": "Looking for vastu compliant...",
  "source": "Website Lead Form",
  "timestamp": "2024-12-01T10:30:00.000Z"
}
```

**Suggested n8n workflow:**
1. Webhook trigger → receives form data
2. Google Sheets node → append row
3. WhatsApp Business API / Twilio node → send confirmation message
4. Gmail node → send email notification to you

---

## 📱 WhatsApp Number

Currently set to: **+91 79996-02952**

To update, search & replace `917999602952` in all HTML files.

---

## 🎨 Customisation

### Colors (in `css/style.css` `:root`):
- `--accent: #FF6A00` → Change orange accent colour
- `--bg-primary: #0B0B0B` → Main background

### Add Real Property Images:
Replace Unsplash URLs in property cards with your actual property photos.

### Add Real Properties:
Copy any `.property-card` block and update:
- `data-budget="budget|mid|luxury"`
- `data-location="bijalpur|manik-bagh|khatiwala|dhar-road"`
- `data-type="flat|villa|plot"`

---

## ✅ Checklist Before Going Live

- [ ] Replace WhatsApp number if different
- [ ] Set your n8n webhook URL in `main.js`
- [ ] Add real property images
- [ ] Add your email in contact page
- [ ] Set up your domain
- [ ] Add Google Analytics (optional)
- [ ] Submit sitemap to Google Search Console (SEO)

---

*Built with ❤️ for Zakir's Realty, Indore*
