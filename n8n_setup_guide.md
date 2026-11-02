# 📱 n8n Setup Guide — WhatsApp Notification for Site Visit Bookings

When someone submits the Book Site Visit form, this n8n workflow will:
1. Receive the booking data
2. Send YOU a WhatsApp notification with all booking details
3. (Optional) Save to Google Sheets

---

## STEP 1 — Install n8n (Free, takes 5 minutes)

### Easiest Option: n8n Cloud (Recommended for beginners)
1. Go to → https://app.n8n.cloud/register
2. Create a free account
3. You'll get a URL like: `https://yourname.app.n8n.cloud`

### Alternative: Run locally (advanced)
```bash
npx n8n
```
Then open http://localhost:5678

---

## STEP 2 — Create the Workflow in n8n

### Open n8n → Click "New Workflow"

### Add Node 1: Webhook (Trigger)
1. Click the "+" button → Search "Webhook"
2. Set:
   - HTTP Method: **POST**
   - Path: **zakirs-realty-site-visit**
   - Authentication: **None**
3. Click "Listen for Test Event"
4. Copy the **Test URL** — it looks like:
   `https://yourname.app.n8n.cloud/webhook-test/zakirs-realty-site-visit`

### Add Node 2: WhatsApp (Notification to YOU)

**Option A: WhatsApp Business API (Official)**
- Use Twilio's WhatsApp API (free trial available)
- Or Meta's official WhatsApp Cloud API

**Option B: Telegram (Easiest alternative)**
- Use Telegram to get instant booking alerts
- Just as fast, completely free

**Option B Steps (Telegram):**
1. Open Telegram → search "@BotFather" → type /newbot
2. Name your bot: "ZakirsRealtyBot"
3. Copy the **API Token**
4. Open https://t.me/userinfobot to get YOUR chat ID
5. In n8n: Add "Telegram" node
   - Set your API token
   - Chat ID: your personal chat ID
   - Text (copy this exactly):

```
🏠 NEW SITE VISIT BOOKING!

👤 Name: {{ $json.name }}
📱 WhatsApp: {{ $json.phone }}
📍 Location: {{ $json.location }}
💰 Budget: {{ $json.budget }}
🏠 Property Type: {{ $json.propertyType }}
📅 Date: {{ $json.formattedDate }}
🕐 Time Slot: {{ $json.timeSlot }}
📝 Notes: {{ $json.notes || 'None' }}

⏰ Submitted: {{ $json.timestamp }}

Reply to client:
wa.me/{{ $json.whatsappNumber }}
```

### Add Node 3 (Optional): Google Sheets
1. Add "Google Sheets" node
2. Connect your Google account
3. Select your spreadsheet
4. Map fields:
   - Name → {{ $json.name }}
   - Phone → {{ $json.phone }}
   - Location → {{ $json.location }}
   - Budget → {{ $json.budget }}
   - Date → {{ $json.formattedDate }}
   - Time → {{ $json.timeSlot }}
   - Submitted → {{ $json.timestamp }}

---

## STEP 3 — Connect Your Website to n8n

1. In n8n, click **"Activate"** on your workflow
2. Switch from "Test URL" to **"Production URL"**
   - Production URL: `https://yourname.app.n8n.cloud/webhook/zakirs-realty-site-visit`

3. Open `js/book-visit.js` in your website files
4. Find line 7:
   ```javascript
   const N8N_WEBHOOK_URL = 'https://YOUR-N8N-URL/webhook/zakirs-realty-site-visit';
   ```
5. Replace with YOUR actual URL:
   ```javascript
   const N8N_WEBHOOK_URL = 'https://yourname.app.n8n.cloud/webhook/zakirs-realty-site-visit';
   ```

---

## STEP 4 — Test It

1. Open your website → Book Site Visit page
2. Fill the form and submit
3. Check your Telegram / WhatsApp for the notification
4. Check Google Sheets (if configured)

---

## DATA YOU'LL RECEIVE IN n8n

Every booking sends this JSON payload:

```json
{
  "name": "Rahul Verma",
  "phone": "9876543210",
  "location": "Bijalpur (Rau)",
  "budget": "₹35L – ₹50L",
  "propertyType": "2 BHK Flat",
  "visitDate": "2024-12-15",
  "formattedDate": "Sunday, 15 December 2024",
  "timeSlot": "11:00 AM – 1:00 PM",
  "notes": "Vastu compliant preferred",
  "source": "Book Site Visit Form",
  "timestamp": "2024-12-01T10:30:00.000Z",
  "whatsappNumber": "919876543210"
}
```

---

## TROUBLESHOOTING

**Form submits but no notification received?**
- Check n8n workflow is "Active" (not just saved)
- Verify you're using the Production URL, not Test URL
- Check n8n "Executions" tab for errors

**CORS error in browser console?**
- This is normal in local testing
- Will work fine once deployed to a real domain

**n8n free plan limits?**
- n8n Cloud free plan: 5 active workflows, 2500 executions/month
- For a real estate business this is more than enough

---

*Need help? WhatsApp: +91 79996-02952*
