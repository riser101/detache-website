// Google Apps Script for Detache Waitlist
// Copy this code to Google Apps Script (script.google.com)
// Deploy as a web app and replace the URL in index.html

function doPost(e) {
  try {
    // Get the data from the request
    const data = JSON.parse(e.postData.contents);
    const email = data.email;
    const timestamp = data.timestamp;
    const source = data.source;
    
    // Get or create the spreadsheet
    const spreadsheet = getOrCreateSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    // Check if email already exists
    if (emailExists(sheet, email)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Email already exists in waitlist'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add headers if this is the first entry
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Email', 'Source', 'Date Added']]);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    }
    
    // Add the new email to the spreadsheet
    const lastRow = sheet.getLastRow() + 1;
    sheet.getRange(lastRow, 1, 1, 4).setValues([[
      timestamp,
      email,
      source,
      new Date().toLocaleDateString()
    ]]);
    
    // Send notification email to admin
    sendNotificationEmail(email);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Email added to waitlist successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Server error: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSpreadsheet() {
  const adminEmail = 'sy.yousuf9106@gmail.com';
  
  try {
    // Try to find existing spreadsheet
    const files = DriveApp.getFilesByName('Detache Waitlist');
    if (files.hasNext()) {
      const file = files.next();
      return SpreadsheetApp.openById(file.getId());
    }
  } catch (error) {
    console.log('Existing spreadsheet not found, creating new one');
  }
  
  // Create new spreadsheet
  const spreadsheet = SpreadsheetApp.create('Detache Waitlist');
  
  // Share with admin email
  try {
    spreadsheet.addEditor(adminEmail);
    const file = DriveApp.getFileById(spreadsheet.getId());
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (error) {
    console.error('Error sharing spreadsheet:', error);
  }
  
  return spreadsheet;
}

function emailExists(sheet, email) {
  const emailColumn = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
  return emailColumn.some(row => row[0] === email);
}

function sendNotificationEmail(email) {
  try {
    const adminEmail = 'sy.yousuf9106@gmail.com';
    const subject = 'New Detache Waitlist Signup';
    const body = `
      New user joined the Detache waitlist!
      
      Email: ${email}
      Time: ${new Date().toLocaleString()}
      Source: Website
      
      View full waitlist: https://docs.google.com/spreadsheets/d/${SpreadsheetApp.getActiveSpreadsheet().getId()}
    `;
    
    MailApp.sendEmail(adminEmail, subject, body);
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
}

// Test function to verify everything works
function testFunction() {
  const testData = {
    email: 'test@example.com',
    timestamp: new Date().toISOString(),
    source: 'test'
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  console.log(result.getContent());
} 