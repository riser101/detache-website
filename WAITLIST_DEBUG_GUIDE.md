# Waitlist Debugging Guide

## Issues Fixed

### 1. **CORS and Response Handling**
- **Problem**: Frontend was using `mode: 'no-cors'` which prevented reading responses
- **Solution**: Removed `mode: 'no-cors'` and added proper CORS headers in Google Apps Script
- **Result**: Can now properly handle success/error responses

### 2. **Google Apps Script Improvements**
- Added comprehensive error handling and logging
- Added CORS headers for proper cross-origin requests
- Added email validation on server side
- Added GET endpoint for health checks
- Better error messages and status codes

### 3. **Enhanced Debugging**
- Added console logging in frontend
- Added detailed error messages
- Created test page for isolated testing

## Step-by-Step Deployment

### Google Apps Script Setup

1. **Go to [script.google.com](https://script.google.com)**

2. **Create a new project or open existing one**

3. **Replace the code with the updated `waitlist-google-script.js`**

4. **Deploy as Web App:**
   - Click "Deploy" → "New deployment"
   - Choose type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone" (important for public access)
   - Click "Deploy"

5. **Copy the Web App URL**
   - Should look like: `https://script.google.com/macros/s/[SCRIPT_ID]/exec`

6. **Update the URL in your HTML files:**
   - Replace the URL in `index.html` (line ~1323)
   - Replace the URL in `test-waitlist.html` if using

### Testing Steps

1. **Test with the debugging page:**
   ```bash
   # Open test-waitlist.html in your browser
   open test-waitlist.html
   ```

2. **Check API Health:**
   - Click "Test API Health" button
   - Should return success message

3. **Test Email Submission:**
   - Enter a test email
   - Click "Test Submission"
   - Check for success/error responses

4. **Check the spreadsheet:**
   - Go to [Google Drive](https://drive.google.com)
   - Look for "Detache Waitlist" spreadsheet
   - Verify entries are being added

### Common Issues & Solutions

#### Issue: CORS Errors
```
Access to fetch at 'https://script.google.com/...' from origin 'null' has been blocked by CORS policy
```
**Solution:**
- Ensure Google Apps Script is deployed with "Anyone" access
- Verify CORS headers are included in the script
- Check that you're not using `mode: 'no-cors'`

#### Issue: 404 Not Found
```
Failed to fetch: 404 Not Found
```
**Solution:**
- Verify the Google Apps Script URL is correct
- Ensure the script is properly deployed as a web app
- Check deployment permissions are set to "Anyone"

#### Issue: Empty Response
```
Response is empty or undefined
```
**Solution:**
- Check Google Apps Script logs for errors
- Verify the `doPost` function is correctly handling requests
- Ensure JSON parsing is working properly

#### Issue: Spreadsheet Not Created
```
Email submitted but not appearing in spreadsheet
```
**Solution:**
- Check Google Apps Script execution logs
- Verify permissions for creating/editing spreadsheets
- Check if admin email (sy.yousuf9106@gmail.com) has access

### Debugging Tools

1. **Browser Developer Tools:**
   - Open Network tab to see request/response details
   - Check Console for JavaScript errors
   - Verify request payload and response data

2. **Google Apps Script Logs:**
   - Go to script.google.com → your project
   - Click "Executions" to see execution logs
   - Check for errors and console.log outputs

3. **Test Page Features:**
   - API health check
   - Detailed request/response logging
   - Error message display
   - Payload inspection

### Monitoring & Maintenance

1. **Regular Checks:**
   - Test the API health endpoint
   - Monitor Google Apps Script quotas
   - Check spreadsheet for new entries

2. **Error Monitoring:**
   - Set up Google Apps Script email notifications
   - Monitor browser console for client-side errors
   - Regular testing with the debug page

### Security Notes

- The script validates email addresses server-side
- Prevents duplicate email submissions
- Includes rate limiting through Google Apps Script quotas
- Admin email notifications for new signups

## Files Modified

- `index.html` - Fixed frontend CORS and response handling
- `waitlist-google-script.js` - Enhanced with proper CORS, validation, and logging
- `test-waitlist.html` - New debugging tool (can be deleted after testing)
- `WAITLIST_DEBUG_GUIDE.md` - This guide (can be deleted after setup)

## Next Steps

1. Deploy the updated Google Apps Script
2. Test with `test-waitlist.html`
3. Verify the main site works with `index.html`
4. Remove test files once everything is working
5. Monitor the spreadsheet for new signups 