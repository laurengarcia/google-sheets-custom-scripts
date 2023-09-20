// Add button to "Custom Scripts" menu in Google Sheets UI
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Scripts')
      // First arg is label, second arg is fn to call (below)
      .addItem('exportBuySellCSVForTaxes','exportBuySellCSVForTaxes')
      // .addToUi()
      .addItem('exportIncomeCSVForTaxes','exportIncomeCSVForTaxes')
      .addToUi();
}


// Generate BUY & SELL CSV formatted for Coinledger.io (was cryptotrader.tax)
// https://help.cryptotrader.tax/en/articles/3320712-other-exchange-guide-detailed-format
function exportBuySellCSVForTaxes() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const sheetName = sheet.getName();
  const fileName = sheetName + '_BUYSELL_coinledger_io-2021.csv';
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
    // loop through the readData in the range (row 7 is where transaction data begins on our _Tokens sheets)
    // & build a string for the csv with the writeData 
    if (readData.length > 1) {
      var csv = "";
      for (var row = 7; row < readData.length; row++) {  
        let tradeType = readData[row][1];
        if (tradeType === 'BUY' || tradeType === 'SELL') {    
          writeData[row] = [];
          const utcTimestamp = Utilities.formatDate(new Date(readData[row][0]), 'GMT', "MM/dd/yyy 00:00:00");
          writeData[row].push("\"" + utcTimestamp + "\""); // UTC Timestamp
          // Extract data from last column 
          // Expected format in sheet: "ExchangeName.com: comments: https://<block explorer transaction url>"
          const rawExchangeMetadata = readData[row][10]; 
          const exchangeName = rawExchangeMetadata ? rawExchangeMetadata.split(":")[0] : "";
          const blockExplorerLink = rawExchangeMetadata.match(/https:\/\/.*/gi);
          const exchange = blockExplorerLink ? `${exchangeName}: ${blockExplorerLink[0]}` : exchangeName;
          writeData[row].push("\"" + exchange + "\""); // Exchange
          // Trade Type: BUY or SELL (only)
          writeData[row].push("\"" + tradeType + "\""); // Trade Type
          const baseAmount = Math.abs(readData[row][2]); 
          writeData[row].push("\"" + readData[0][0] + "\""); // Base Currency
          writeData[row].push("\"" + baseAmount + "\""); // Base Amount
          writeData[row].push("\"USD\""); // Quote Currency -- always converted to USD in these spreadsheets
          const quoteAmount = baseAmount * readData[row][6]; // Quote Amount -- baseAmount * price
          writeData[row].push("\"" + quoteAmount + "\""); // Quote Amount               
          writeData[row].push("\"USD\""); // Fee Currency -- always converted to USD in these spreadsheets
          writeData[row].push("\"" + readData[row][7] + "\""); // Fee Amount 

          // Join each row's columns
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


// Generate INCOME CSVs for Coinledger.io (was cryptotrader.tax)
// for MINING, STAKING, INTEREST, AIRDROP, HARD FORK, INCOME

function exportIncomeCSVForTaxes() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const sheetName = sheet.getName();
  const fileName = sheetName + '_INCOME_coinledger_io-2021.csv';
  const csvFile = convertRangeToCsvFile2(fileName, sheet);
  var file = DriveApp.createFile(fileName, csvFile);
  Browser.msgBox('Done! ' + fileName + ' created.');
};


function convertRangeToCsvFile2(csvFileName, sheet) {
  let activeRange = sheet.getDataRange();
  try {
    let readData = activeRange.getValues();
    let writeData = [];
    let colHeaders = "\"Coin Symbol\",\"Amount\",\"Timestamp\",\"Incoming Type\"\r\n";
    let csvFile = undefined;
    // loop through the readData in the range (row 7 is where transaction data begins on our _Tokens sheets)
    // & build a string for the csv with the writeData 
    if (readData.length > 1) {
      var csv = "";
      for (var row = 7; row < readData.length; row++) {  
        let tradeType = readData[row][1];
        // Must be labeled as: 
        // Income, Mining, Staking, Gift, Airdrop, Interest, Hard Fork
        if (tradeType === 'Income' || tradeType === 'Staking' || tradeType === 'Mining' || tradeType === 'Interest' || tradeType === 'Airdrop' || tradeType === 'Hard Fork' || tradeType === 'Gift') {    
          writeData[row] = [];
          // Coin Symbol
          writeData[row].push("\"" + readData[0][0] + "\""); 
          // Amount
          const baseAmount = Math.abs(readData[row][2]); 
          writeData[row].push("\"" + baseAmount + "\""); 
          // UTC Timestamp
          const utcTimestamp = Utilities.formatDate(new Date(readData[row][0]), 'GMT', "MM/dd/yyy 00:00:00");
          writeData[row].push("\"" + utcTimestamp + "\""); 
          // Incoming Type
          writeData[row].push("\"" + tradeType + "\""); 

          // Join each row's columns
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
