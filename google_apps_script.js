// ============================================
// ALI REAL ESTATE — Google Apps Script
// Paste this in Google Apps Script editor
// ============================================
// Sheet ID: 1BEQtQmR3RLsk6ILWX_XuUfYQJJpWh-KNTWFlIKvIllI
// ============================================

function doPost(e) {
  try {
    // Get the spreadsheet
    var sheet = SpreadsheetApp.openById('1BEQtQmR3RLsk6ILWX_XuUfYQJJpWh-KNTWFlIKvIllI').getActiveSheet();
    
    // Parse incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Name',
        'Phone',
        'Location', 
        'Budget',
        'Property Type',
        'Visit Date',
        'Time Slot',
        'Notes',
        'Submitted At'
      ]);
      
      // Style header row
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setBackground('#FF6A00');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
    }
    
    // Append the form data as a new row
    sheet.appendRow([
      data.name        || '',
      data.phone       || '',
      data.location    || '',
      data.budget      || '',
      data.propertyType || '',
      data.visitDate   || '',
      data.timeSlot    || '',
      data.notes       || '',
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    ]);
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Data saved!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Ali Real Estate API is running!' }))
    .setMimeType(ContentService.MimeType.JSON);
}
