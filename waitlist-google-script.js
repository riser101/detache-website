// Google Apps Script for Detache Waitlist
// Copy this code to Google Apps Script (script.google.com)
// Deploy as a web app and replace the URL in index.html

// Handle GET requests (for health checks)
function doGet(e) {
  return createResponse({
    success: true,
    message: 'Detache Waitlist API is running',
    timestamp: new Date().toISOString()
  });
}

// Handle POST requests (for form submissions)
function doPost(e) {
  try {
    console.log('Received POST request');
    console.log('Request data:', e.postData ? e.postData.contents : 'No postData');
    
    // Validate request data
    if (!e.postData || !e.postData.contents) {
      console.error('No post data received');
      return createResponse({
        success: false,
        message: 'No data received'
      }, 400);
    }
    
    // Parse the data from the request
    let data;
    try {
      data = JSON.parse(e.postData.contents);
      console.log('Parsed data:', data);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return createResponse({
        success: false,
        message: 'Invalid JSON data'
      }, 400);
    }
    
    const email = data.email;
    const timestamp = data.timestamp;
    const source = data.source || 'unknown';
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      console.error('Invalid email:', email);
      return createResponse({
        success: false,
        message: 'Invalid email address'
      }, 400);
    }
    
    console.log('Processing email:', email);
    
    // Get or create the spreadsheet
    const spreadsheet = getOrCreateSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    // Check if email already exists
    if (emailExists(sheet, email)) {
      console.log('Email already exists:', email);
      return createResponse({
        success: false,
        message: 'Email already exists in waitlist'
      }, 409);
    }
    
    // Add headers if this is the first entry
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Email', 'Source', 'Date Added']]);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      console.log('Added headers to spreadsheet');
    }
    
    // Add the new email to the spreadsheet
    const lastRow = sheet.getLastRow() + 1;
    sheet.getRange(lastRow, 1, 1, 4).setValues([[
      timestamp,
      email,
      source,
      new Date().toLocaleDateString()
    ]]);
    
    console.log('Added email to spreadsheet at row:', lastRow);
    
    // Send notification email to admin
    try {
      sendNotificationEmail(email);
      console.log('Notification email sent');
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the entire request if email fails
    }
    
    return createResponse({
      success: true,
      message: 'Email added to waitlist successfully'
    });
      
  } catch (error) {
    console.error('Unexpected error:', error);
    return createResponse({
      success: false,
      message: 'Server error: ' + error.toString()
    }, 500);
  }
}

// Unified response creator with proper CORS headers
function createResponse(data, statusCode = 200) {
  return ContentService
    .createTextOutput(JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
      statusCode: statusCode
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
}

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
  // Handle empty sheet case
  if (sheet.getLastRow() <= 1) {
    return false; // No data rows exist
  }
  
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

// Simple test function to run directly in Google Apps Script
function simpleTest() {
  try {
    console.log('Testing waitlist functionality...');
    
    // Test email validation
    console.log('Email validation test:', isValidEmail('test@example.com')); // Should be true
    console.log('Email validation test:', isValidEmail('invalid')); // Should be false
    
    // Test spreadsheet creation
    const spreadsheet = getOrCreateSpreadsheet();
    console.log('Spreadsheet created/found:', spreadsheet.getId());
    
    const sheet = spreadsheet.getActiveSheet();
    console.log('Current rows in sheet:', sheet.getLastRow());
    
    // Test adding headers
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Email', 'Source', 'Date Added']]);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      console.log('Headers added');
    }
    
    // Test adding an email
    const testEmail = 'debug@example.com';
    const lastRow = sheet.getLastRow() + 1;
    sheet.getRange(lastRow, 1, 1, 4).setValues([[
      new Date().toISOString(),
      testEmail,
      'manual-test',
      new Date().toLocaleDateString()
    ]]);
    
    console.log('Test email added at row:', lastRow);
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
} 