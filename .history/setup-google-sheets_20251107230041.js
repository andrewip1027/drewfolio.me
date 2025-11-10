/*
 * GOOGLE SHEETS VISITOR LOGGING SETUP
 * 
 * INSTRUCTIONS TO SET UP:
 * 
 * 1. Create a new Google Sheet: https://sheets.google.com
 * 2. Name your sheet "Portfolio Visitor Logs"
 * 3. Go to Extensions > Apps Script
 * 4. Delete any existing code
 * 5. Paste THIS ENTIRE FILE into the script editor
 * 6. Click "Deploy" > "New deployment"
 * 7. Choose type: "Web app"
 * 8. Execute as: "Me"
 * 9. Who has access: "Anyone"
 * 10. Click "Deploy"
 * 11. Copy the Web App URL
 * 12. Paste it in index.html where it says "YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE"
 * 
 * The sheet will automatically create columns on first run!
 */

function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Check if headers exist (first row)
    if (sheet.getLastRow() === 0) {
      // Create headers
      sheet.appendRow([
        'Timestamp',
        'IP Address',
        'City',
        'Region',
        'Country',
        'Country Code',
        'Platform',
        'Language',
        'Screen Resolution',
        'Timezone',
        'Referrer',
        'Page URL',
        'User Agent'
      ]);
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, 13);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#667eea');
      headerRange.setFontColor('#ffffff');
    }
    
    // Add the visitor data as a new row
    sheet.appendRow([
      data.timestamp || '',
      data.ip || 'Unknown',
      data.city || 'Unknown',
      data.region || 'Unknown',
      data.country || 'Unknown',
      data.countryCode || 'Unknown',
      data.platform || 'Unknown',
      data.language || 'Unknown',
      data.screenResolution || 'Unknown',
      data.timezone || 'Unknown',
      data.referrer || 'Direct visit',
      data.currentPage || '',
      data.userAgent || 'Unknown'
    ]);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 13);
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Visitor logged successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional - for debugging)
function testLogging() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        ip: '192.168.1.1',
        city: 'Toronto',
        region: 'Ontario',
        country: 'Canada',
        countryCode: 'CA',
        platform: 'Win32',
        language: 'en-US',
        screenResolution: '1920x1080',
        timezone: 'America/Toronto',
        referrer: 'Direct visit',
        currentPage: 'https://example.com',
        userAgent: 'Mozilla/5.0 Test'
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
