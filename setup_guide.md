# Ali Real Estate Website — Setup Guide

## Step 1: Google Apps Script Setup (For Google Sheets)

1. Go to: https://script.google.com
2. Click "New Project"
3. Delete all existing code
4. Copy ALL code from GOOGLE_APPS_SCRIPT.js and paste it
5. Click "Save" (Ctrl+S) — name it "Ali Real Estate"
6. Click "Deploy" → "New deployment"
7. Type: "Web app"
8. Settings:
   - Execute as: Me
   - Who has access: Anyone
9. Click "Deploy" → Copy the Web App URL

## Step 2: Update Website

Open js/book-visit.js
Replace line 1:
const GOOGLE_SCRIPT_URL = 'YOUR_URL_HERE';
With your actual Web App URL from Step 1.

## Step 3: Upload to Netlify

Drag and drop the entire folder to Netlify.
Done! Form submissions will now save to Google Sheets.

