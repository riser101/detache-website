// Super Simple Google Apps Script for Detache Waitlist
// Copy this code to Google Apps Script (script.google.com)
// Deploy as a web app: Execute as "Me", Access "Anyone"

function doGet(e) {
  try {
    console.log('GET request received:', e.parameter);
    
    const email = e.parameter.email;
    const source = e.parameter.source || 'website';
    
    if (!email) {
      return ContentService.createTextOutput('Email required').setMimeType(ContentService.MimeType.TEXT);
    }
    
    // Save email to sheet
    saveEmailToSheet(email, source);
    
    return ContentService.createTextOutput('Success').setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService.createTextOutput('Error: ' + error.message).setMimeType(ContentService.MimeType.TEXT);
  }
}

function saveEmailToSheet(email, source) {
  try {
    // Get or create the spreadsheet
    const spreadsheet = getOrCreateSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    // Add headers if this is the first entry
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Email', 'Source', 'Date Added']]);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    }
    
    // Add the new email to the spreadsheet
    const lastRow = sheet.getLastRow() + 1;
    sheet.getRange(lastRow, 1, 1, 4).setValues([[
      new Date().toISOString(),
      email,
      source,
      new Date().toLocaleDateString()
    ]]);
    
    console.log('Added email to spreadsheet:', email);
    
    // Send notification email to admin
    try {
      sendNotificationEmail(email);
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }
    
    return { success: true };
      
  } catch (error) {
    console.error('Error saving email:', error);
    throw error;
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

function sendNotificationEmail(email) {
  try {
    const adminEmail = 'sy.yousuf9106@gmail.com';
    const subject = 'New Detache Waitlist Signup';
    const body = `
      New user joined the Detache waitlist!
      
      Email: ${email}
      Time: ${new Date().toLocaleString()}
      Source: Website
      
      View the spreadsheet: https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
    `;
    
    MailApp.sendEmail({
      to: adminEmail,
      subject: subject,
      body: body
    });
    
    console.log('Notification email sent to:', adminEmail);
    
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw error;
  }
}

// Simple test function
function testScript() {
  console.log('Testing script...');
  const result = saveEmailToSheet('test@example.com', 'test');
  console.log('Test result:', result);
} 