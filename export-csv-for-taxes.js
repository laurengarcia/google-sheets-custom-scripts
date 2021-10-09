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
  const fileName = sheetName + '_cryptotrader_tax.csv';
  const csvFile = convertRangeToCsvFile(fileName, sheet);
  var file = DriveApp.createFile(fileName, csvFile);
  Browser.msgBox('Done! ' + fileName + ' created.');
};

function convertRangeToCsvFile(csvFileName, sheet) {
  let activeRange = sheet.getDataRange();
  try {
    let data = activeRange.getValues();
    let csvFile = undefined;

    // loop through the data in the range and build a string with the csv data
    if (data.length > 1) {
      var csv = "";
      for (var row = 0; row < data.length; row++) {
        for (var col = 0; col < data[row].length; col++) {
          if (data[row][col].toString().indexOf(",") != -1) {
            data[row][col] = "\"" + data[row][col] + "\"";
          }
        }

        // join each row's columns
        // add a carriage return to end of each row, except for the last one
        if (row < data.length-1) {
          csv += data[row].join(",") + "\r\n";
        }
        else {
          csv += data[row];
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
