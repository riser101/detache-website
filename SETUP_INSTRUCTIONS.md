# Detache Waitlist Setup Instructions

## Overview
This setup will create a waitlist form that saves email addresses to a Google Spreadsheet and sends notification emails to sy.yousuf9106@gmail.com.

## Step 1: Create Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Delete the default code
4. Copy and paste the entire content from `waitlist-google-script.js`
5. Save the project (Ctrl/Cmd + S) and name it "Detache Waitlist"

## Step 2: Deploy as Web App

1. In Google Apps Script, click "Deploy" → "New Deployment"
2. Click the gear icon ⚙️ next to "Type" and select "Web app"
3. Fill in the deployment settings:
   - **Description**: "Detache Waitlist Handler"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click "Deploy"
5. **IMPORTANT**: Copy the Web App URL that appears (it looks like: `https://script.google.com/macros/s/AKfycby...../exec`)

## Step 3: Update Website Code

1. Open `index.html`
2. Find this line in the JavaScript (around line 950):
   ```javascript
   const response = await fetch('https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec', {
   ```
3. Replace the URL with your actual Web App URL from Step 2

## Step 4: Test the Setup

1. Open your website
2. Click "Join Waitlist" button
3. Enter a test email address
4. Submit the form
5. Check if:
   - You see a success toast message
   - A new Google Spreadsheet called "Detache Waitlist" was created
   - You received a notification email at sy.yousuf9106@gmail.com
   - The email appears in the spreadsheet

## What Happens When Someone Joins

1. **User submits email** → Modal form appears and collects email
2. **Data is sent** → JavaScript sends email + timestamp to Google Apps Script
3. **Spreadsheet updated** → New row added with email, timestamp, source, and date
4. **Email notification** → You get notified at sy.yousuf9106@gmail.com
5. **Success message** → User sees a green toast notification

## Spreadsheet Columns

The spreadsheet will have these columns:
- **Timestamp**: ISO timestamp when submitted
- **Email**: User's email address
- **Source**: Always "website" for web submissions
- **Date Added**: Human-readable date

## Security Features

- ✅ Email validation (proper email format)
- ✅ Duplicate email prevention
- ✅ Rate limiting through Google Apps Script
- ✅ Secure CORS handling
- ✅ Error handling and user feedback

## Troubleshooting

### "Something went wrong" message
- Check that the Web App URL is correct in index.html
- Ensure the Google Apps Script is deployed as "Anyone" can access
- Check the Google Apps Script logs for errors

### No email notifications
- Check spam folder
- Verify sy.yousuf9106@gmail.com is correct
- Check Google Apps Script execution transcript

### Spreadsheet not created
- Ensure the script has permission to create files
- Check Google Drive permissions
- Run the `testFunction()` in Google Apps Script manually

## Optional Customizations

### Change admin email:
In `waitlist-google-script.js`, update both instances of:
```javascript
const adminEmail = 'sy.yousuf9106@gmail.com';
```

### Modify spreadsheet name:
Change this line:
```javascript
const files = DriveApp.getFilesByName('Detache Waitlist');
```

### Update notification email format:
Modify the `sendNotificationEmail()` function in the script.

## Support
If you encounter issues, check the Google Apps Script execution transcript (View → Execution transcript) for detailed error messages. 