// Add button to "Custom Scripts" menu in Google Sheets UI
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Scripts')
      // First arg is label, second arg is fn to call (below)
      .addItem('exportCSVForTaxes','exportCSVForTaxes')
      .addToUi();
}

// CSV Formatted for Cryptotrader.tax
// https://help.cryptotrader.tax/en/articles/3320712-other-exchange-guide-detailed-format
function exportCSVForTaxes() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const sheetName = sheet.getName();
  const fileName = sheetName + '_cryptotrader_tax-9.csv';
  const csvFile = convertRangeToCsvFile(fileName, sheet);
  var file = DriveApp.createFile(fileName, csvFile);
  Browser.msgBox('Done! ' + fileName + ' created.');
};

function convertRangeToCsvFile(csvFileName, sheet) {
  let activeRange = sheet.getDataRange();
  try {
    let data = activeRange.getValues();
    let newData = [];
    let csvFile = undefined;
    // loop through the data in the range and build a string with the csv data
    if (data.length > 1) {
      var csv = "";
      for (var row = 7; row < data.length; row++) {      
        newData[row] = [];
        newData[row].push("\"" + data[row][0] + "\"");
        newData[row].push("\"" + data[row][1] + "\"");
        const baseAmount = Math.abs(data[row][2]);
        newData[row].push("\"" + baseAmount + "\"");
        newData[row].push("\"" + data[0][0] + "\"");
        const quoteAmount = baseAmount * data[row][6]; // baseAmount * price
        newData[row].push("\"" + quoteAmount + "\"");                
        // join each row's columns
        // add a carriage return to end of each row, except for the last one
        if (row >= 7 && row < data.length-1) {
          csv += newData[row].join(",") + "\r\n";
        }
        else if (row >= 7) {
          csv += newData[row].join(",");
        }
      }
      csvFile = csv;
    }
    return csvFile;

  } catch (err) {
    Logger.log(err);
    Browser.msgBox(err);
  }
}
