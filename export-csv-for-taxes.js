// Add button to "Custom Scripts" menu in Google Sheets UI
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Scripts')
      // First arg is label, second arg is fn to call (below)
      .addItem('exportBuySellCSVForTaxes','exportBuySellCSVForTaxes')
      .addToUi();
}

// CSV Formatted for Cryptotrader.tax-- BUY and SELL data ONLY
// https://help.cryptotrader.tax/en/articles/3320712-other-exchange-guide-detailed-format
function exportBuySellCSVForTaxes() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const sheetName = sheet.getName();
  const fileName = sheetName + '_cryptotrader_tax-3.csv';
  const csvFile = convertRangeToCsvFile(fileName, sheet);
  var file = DriveApp.createFile(fileName, csvFile);
  Browser.msgBox('Done! ' + fileName + ' created.');
};

function convertRangeToCsvFile(csvFileName, sheet) {
  let activeRange = sheet.getDataRange();
  try {
    let readData = activeRange.getValues();
    let writeData = [];
    let colHeaders = "\"UTC Timestamp\",\"Exchange\",\"Trade Type\",\"Base Currency\",\"Base Amount\",\"Quote Currency\",\"Quote Amount\",\"Fee Currency\",\"Fee Amount\"\r\n";
    let csvFile = undefined;
    // loop through the readData in the range and build a string for the csv with the writeData 
    if (readData.length > 1) {
      var csv = "";
      for (var row = 7; row < readData.length; row++) {  
        let tradeType = readData[row][1];
        if (tradeType === 'BUY' || tradeType === 'SELL') {    
          writeData[row] = [];
          writeData[row].push("\"" + readData[row][0] + "\""); // UTC Timestamp
          writeData[row].push("\"" + readData[row][9] + "\""); // Exchange
          writeData[row].push("\"" + tradeType + "\""); // Trade Type
          const baseAmount = Math.abs(readData[row][2]); 
          writeData[row].push("\"" + readData[0][0] + "\""); // Base Currency
          writeData[row].push("\"" + baseAmount + "\""); // Base Amount
          writeData[row].push("\"USD\""); // Quote Currency -- always converted to USD in these spreadsheets
          const quoteAmount = baseAmount * readData[row][6]; // Quote Amount -- baseAmount * price
          writeData[row].push("\"" + quoteAmount + "\""); // Quote Amount               
          writeData[row].push("\"USD\""); // Fee Currency -- always converted to USD in these spreadsheets
          writeData[row].push("\"0\""); // Fee Amount -- set to 0 here, look up in a later script

          // join each row's columns
          // add a carriage return to end of each row, except for the last one
          if (row >= 7 && row < readData.length-1) {
            csv += writeData[row].join(",") + "\r\n";
          }
          else if (row >= 7) {
            csv += writeData[row].join(",");
          }
        }
      }
      csvFile = colHeaders + csv;
    }
    return csvFile;

  } catch (err) {
    Logger.log(err);
    Browser.msgBox(err);
  }
}
