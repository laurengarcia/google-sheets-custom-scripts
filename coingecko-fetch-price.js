// Add button to "Custom Scripts" menu in Google Sheets UI
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Scripts')
      // First arg is label, second arg is fn to call (below)
      .addItem('getCryptoPrices','getCryptoPrices')
      .addToUi();
}

// CoinGecko API:
// https://www.coingecko.com/en/api#explore-api

// Coin id lookup here:
// https://api.coingecko.com/api/v3/coins/list

coinIdToCell = {
  'ethereum': 'D4',
  'the-graph': 'D5',
  'matic-network': 'D6',
  'cosmos': 'D7', // atom
  'terra-luna': 'D8'
};

function getPricesFromCoinGeckoApi(coinIds) {
  const _coinIds = Object.keys(coinIdToCell).join(',');
  //ex: https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network,omisego&vs_currencies=usd
  const queryUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${_coinIds}&vs_currencies=usd`;
  const response = UrlFetchApp.fetch(queryUrl);
  const raw = response.getContentText();
  const data = JSON.parse(raw);
  Logger.log(data);
  return data;
}

function getCryptoPrices() {
  const data = getPricesFromCoinGeckoApi();
  const sheet = SpreadsheetApp.getActiveSheet();
  Object.keys(coinIdToCell).forEach((coinId) => {
    const price = data[coinId].usd;  
    Logger.log(coinId, price, coinIdToCell[coinId]);
    sheet.getRange(coinIdToCell[coinId]).setValue(price);                            
  });
};
