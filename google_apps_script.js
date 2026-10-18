/**
 * ==============================================================================
 * MADHAVBAUG AYUSTREE™ PCOD / PCOS SUPPORT - GOOGLE APPS SCRIPT WEBHOOK CODE
 * ==============================================================================
 * Google Sheets Setup Guide:
 * 
 * 1. Open Google Sheets (create a new sheet titled "Madhavbaug AyuStree PCOD Leads")
 * 2. Click "Extensions" -> "Apps Script"
 * 3. Delete any default code in Code.gs, paste this entire file contents
 * 4. Click "Save" icon
 * 5. Click "Deploy" (top right) -> "New deployment"
 * 6. Under "Select type" (gear icon), choose "Web app"
 * 7. Description: "AyuStree PCOD Leads Webhook"
 * 8. Execute as: "Me" (your Google account)
 * 9. Who has access: "Anyone"
 * 10. Click "Deploy" and authorize permissions
 * 11. Copy the generated Web App URL and paste it into assets/js/main.js
 * 
 * Active Webhook URL:
 * https://script.google.com/macros/s/AKfycbxpp2MABmggQR5P7MvmjCNxuV22hd-gLHxWryuBkP1i5huwyl0q1XKvsQvNu5eYFztgjQ/exec
 * ==============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rawData = e.postData.contents;
    var data;

    try {
      data = JSON.parse(rawData);
    } catch (parseErr) {
      data = e.parameter;
    }

    // Append header if sheet is new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Order ID",
        "Name",
        "Contact Number",
        "Delivery Address",
        "City",
        "State",
        "Pincode",
        "Package",
        "Price",
        "Payment Mode",
        "Device / User Agent"
      ]);
      sheet.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#FCE4EC");
    }

    var timestamp = new Date();
    var formattedDate = Utilities.formatDate(timestamp, "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");
    var orderId = "AYU-" + Math.floor(100000 + Math.random() * 900000);

    var name = data.name || "N/A";
    var phone = data.phone || data.contact || "N/A";
    var address = data.address || "N/A";
    var city = data.city || "N/A";
    var state = data.state || "N/A";
    var pincode = data.pincode || "N/A";
    var packageSelected = data.package || data.selectedPack || "1 Pack (30 Chewable Tablets for 30 Days)";
    var price = data.price || "₹899";
    var paymentMode = "Cash On Delivery (COD)";
    var userAgent = data.userAgent || "Web / Mobile";

    sheet.appendRow([
      formattedDate,
      orderId,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      packageSelected,
      price,
      paymentMode,
      userAgent
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: "success", 
        orderId: orderId,
        message: "Order placed successfully on COD!" 
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: "error", 
        message: err.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
