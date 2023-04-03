// Add button to "Custom Scripts" menu in Google Sheets UI
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Get Prices')
    // First arg is label, second arg is fn to call (below)
    .addItem('getCoinGecko','getCoinGeckoPrices')
    .addToUi();
}


// TODO:
// Use Kraken API:
// https://docs.kraken.com/rest/#tag/Market-Data/operation/getTickerInformation
// Query List of Assets:
// https://api.kraken.com/0/public/Assets
// Ex query: 
// https://api.kraken.com/0/public/Ticker?pair=ETHUSD,AAVEUSD


// CoinGecko API:
// https://www.coingecko.com/en/api#explore-api

// Coin id lookup here:
// https://api.coingecko.com/api/v3/coins/list

const coinIdToCell = {
  'D4': { 'CG': 'bitcoin' },
  'D5': { 'CG': 'ethereum' },
  'D6': { 'CG': 'the-graph' },
  'D7': { 'CG': 'matic-network' },
  'D8': { 'CG': 'cosmos' },
  'D9': { 'CG': 'terra-luna' },
  'D10': { 'CG': 'terra-luna2' },
  'D11': { 'CG': 'curve-dao-token' },
  'D12': { 'CG': 'uniswap' },
  'D13': { 'CG': 'truefi' },
  'D14': { 'CG': 'aave' },
  'D15': { 'CG': 'radicle' },
  'D16': { 'CG': 'mantra-dao' },
  'D17': { 'CG': 'bzx-protocol' },
  'D18': { 'CG': 'ethereum-name-service' },
};

function getPricesFromCoinGeckoApi(coinIds) {
  const _coinIds = Object.keys(coinIdToCell).map((cell) => coinIdToCell[cell].CG).join(',');
  // ex: https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,thegraph&vs_currencies=usd
  const queryUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${_coinIds}&vs_currencies=usd`;
  const response = UrlFetchApp.fetch(queryUrl);
  const raw = response.getContentText();
  const data = JSON.parse(raw);
  return data;
}

function getCoinGeckoPrices() {
  const data = getPricesFromCoinGeckoApi();
  const sheet = SpreadsheetApp.getActiveSheet();
  Object.keys(coinIdToCell).forEach((cell) => {
    const coinId = coinIdToCell[cell].CG;
    const coinData = data[coinId];
    const price = coinData ? coinData.usd : 'N/A';
    const exchange = 'CG';
    const assetId = coinIdToCell[cell][exchange];
    sheet.getRange(cell).setValue(price);
  });
};
