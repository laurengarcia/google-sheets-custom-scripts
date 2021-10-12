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
  const fileName = sheetName + '_cryptotrader_tax-7.csv';
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
        for (var col = 0; col < data[row].length; col++) {
            
              // add logic here to build new cryptotrader.tax columns instead
              if (col === 0 || col === 1) {
                newData[row].push("\"" + data[row][col] + "\"");
              }
              if (col === 2) { 
                const baseAmount = Math.abs(data[row][col]);
                newData[row].push("\"" + baseAmount + "\"");
              }
              if (col === 3 ) { 
                newData[row].push("\"" + data[0][0] + "\"");
              } 
              if (col === 6) {
                const quoteAmount = data[row][col] * Math.abs(data[row][2]); // price * baseAmount
                newData[row].push = "\"" + quoteAmount + "\"";                
              }
              else {
                // do nothing
              }

        }

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
