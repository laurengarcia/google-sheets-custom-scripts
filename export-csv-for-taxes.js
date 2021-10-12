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
  const fileName = sheetName + '_cryptotrader_tax-1.csv';
  const csvFile = convertRangeToCsvFile(fileName, sheet);
  var file = DriveApp.createFile(fileName, csvFile);
  Browser.msgBox('Done! ' + fileName + ' created.');
};

function convertRangeToCsvFile(csvFileName, sheet) {
  let activeRange = sheet.getDataRange();
  try {
    let readData = activeRange.getValues();
    let writeData = [];
    let csvFile = undefined;
    // loop through the readData in the range and build a string for the csv with the writeData 
    if (readData.length > 1) {
      var csv = "";
      for (var row = 7; row < readData.length; row++) {      
        writeData[row] = [];
        writeData[row].push("\"" + readData[row][0] + "\"");
        writeData[row].push("\"" + readData[row][9] + "\"");
        writeData[row].push("\"" + readData[row][1] + "\"");
        const baseAmount = Math.abs(readData[row][2]);
        writeData[row].push("\"" + baseAmount + "\"");
        writeData[row].push("\"" + readData[0][0] + "\"");
        const quoteAmount = baseAmount * readData[row][6]; // baseAmount * price
        writeData[row].push("\"" + quoteAmount + "\"");                
        // join each row's columns
        // add a carriage return to end of each row, except for the last one
        if (row >= 7 && row < readData.length-1) {
          csv += writeData[row].join(",") + "\r\n";
        }
        else if (row >= 7) {
          csv += writeData[row].join(",");
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
