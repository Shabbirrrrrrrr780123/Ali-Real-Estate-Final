/* ============================================
   ALI REAL ESTATE — BOOK SITE VISIT LOGIC
   Google Sheets Integration (No n8n needed!)
   ============================================
   STEP: Replace GOOGLE_SCRIPT_URL below with
   your deployed Google Apps Script URL
   ============================================ */

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxPD0EuZ6zFXfpMqCXSRctc-KtoPk6qaK-vqTg0cQtpNhwGN_szsy9O3kbQ9G4ooSNqLA/exec';

// ── SET MIN DATE TO TODAY ──
(function setMinDate() {
  const dateInput = document.getElementById('visitDate');
  if (!dateInput) return;
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  dateInput.value = today;
})();

// ── TIME SLOT PICKER ──
document.querySelectorAll('.time-slot').forEach(slot => {
  slot.addEventListener('click', () => {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    slot.classList.add('selected');
    slot.querySelector('input').checked = true;
    document.getElementById('timeError')?.classList.remove('show');
  });
});

// ── VALIDATION ──
function validate(data) {
  let valid = true;
  const nameEl = document.getElementById('name');
  if (!data.name || data.name.trim().length < 2) { nameEl.classList.add('error'); document.getElementById('nameError').classList.add('show'); valid = false; } else { nameEl.classList.remove('error'); document.getElementById('nameError').classList.remove('show'); }
  const phoneEl = document.getElementById('phone');
  const digits = data.phone.replace(/\D/g, '');
  const phoneOk = digits.length === 10 || (digits.length === 12 && digits.startsWith('91'));
  if (!phoneOk) { phoneEl.classList.add('error'); document.getElementById('phoneError').classList.add('show'); valid = false; } else { phoneEl.classList.remove('error'); document.getElementById('phoneError').classList.remove('show'); }
  const locEl = document.getElementById('location');
  if (!data.location) { locEl.classList.add('error'); document.getElementById('locationError').classList.add('show'); valid = false; } else { locEl.classList.remove('error'); document.getElementById('locationError').classList.remove('show'); }
  const budgetEl = document.getElementById('budget');
  if (!data.budget) { budgetEl.classList.add('error'); document.getElementById('budgetError').classList.add('show'); valid = false; } else { budgetEl.classList.remove('error'); document.getElementById('budgetError').classList.remove('show'); }
  const dateEl = document.getElementById('visitDate');
  const today = new Date().toISOString().split('T')[0];
  if (!data.visitDate || data.visitDate < today) { dateEl.classList.add('error'); document.getElementById('dateError').classList.add('show'); valid = false; } else { dateEl.classList.remove('error'); document.getElementById('dateError').classList.remove('show'); }
  if (!data.timeSlot) { document.getElementById('timeError').classList.add('show'); valid = false; } else { document.getElementById('timeError').classList.remove('show'); }
  return valid;
}

// ── COLLECT DATA ──
function collectData() {
  return {
    name:         document.getElementById('name')?.value.trim() || '',
    phone:        document.getElementById('phone')?.value.trim() || '',
    location:     document.getElementById('location')?.value || '',
    budget:       document.getElementById('budget')?.value || '',
    visitDate:    document.getElementById('visitDate')?.value || '',
    propertyType: document.getElementById('propertyType')?.value || 'Not specified',
    timeSlot:     document.querySelector('input[name="timeSlot"]:checked')?.value || '',
    notes:        document.getElementById('notes')?.value.trim() || '',
  };
}

// ── FORMAT DATE ──
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// ── SHOW SUCCESS ──
function showSuccess(data) {
  document.getElementById('visitForm').style.display = 'none';
  const screen = document.getElementById('successScreen');
  const summary = document.getElementById('bookingSummary');
  if (summary) {
    summary.innerHTML = `
      <div><strong>👤 Name:</strong> ${data.name}</div>
      <div><strong>📱 WhatsApp:</strong> ${data.phone}</div>
      <div><strong>📍 Location:</strong> ${data.location}</div>
      <div><strong>💰 Budget:</strong> ${data.budget}</div>
      <div><strong>🏠 Type:</strong> ${data.propertyType}</div>
      <div><strong>📅 Date:</strong> ${formatDate(data.visitDate)}</div>
      <div><strong>🕐 Time:</strong> ${data.timeSlot}</div>
      ${data.notes ? `<div><strong>📝 Notes:</strong> ${data.notes}</div>` : ''}
    `;
  }
  screen.classList.add('show');
  screen.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── FORM SUBMIT ──
const visitForm = document.getElementById('visitForm');
const submitBtn = document.getElementById('submitBtn');

visitForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = collectData();
  if (!validate(data)) {
    visitForm.querySelector('.error, .field-error.show')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  // Send to Google Sheets
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, formattedDate: formatDate(data.visitDate), timestamp: new Date().toISOString() }),
    });
  } catch (err) {
    console.warn('Sheets save error:', err.message);
  }

  submitBtn.classList.remove('loading');
  showSuccess(data);
});

// ── CLEAR ERRORS ──
['name', 'phone', 'location', 'budget', 'visitDate'].forEach(id => {
  const el = document.getElementById(id);
  el?.addEventListener('input', () => { el.classList.remove('error'); document.getElementById(id + 'Error')?.classList.remove('show'); });
  el?.addEventListener('change', () => { el.classList.remove('error'); document.getElementById(id + 'Error')?.classList.remove('show'); });
});
