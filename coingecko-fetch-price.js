// Add button to "Custom Scripts" menu in Google Sheets UI
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Get Prices')
    // First arg is label, second arg is fn to call (below)
    .addItem('getCoinGecko','getCoinGeckoPrices')
    .addItem('getKraken','getKrakenPrices')
    .addToUi();
}

const cellToCoinIds = {
  'D4': { 'CG': 'bitcoin', 'KK': 'XXBTZUSD' },
  'D5': { 'CG': 'ethereum', 'KK': 'XETHZUSD' },
  'D6': { 'CG': 'the-graph', 'KK': 'GRTUSD' },
  'D7': { 'CG': 'matic-network', 'KK': 'MATICUSD' },
  'D8': { 'CG': 'cosmos', 'KK': 'ATOMUSD' },
  'D9': { 'CG': 'terra-luna', 'KK': 'LUNAUSD' },
  'D10': { 'CG': 'terra-luna2', 'KK': 'LUNA2USD' },
  'D11': { 'CG': 'curve-dao-token', 'KK': 'CRVUSD' },
  'D12': { 'CG': 'uniswap', 'KK': 'UNIUSD' },
  'D13': { 'CG': 'truefi', 'KK': 'TRUUSD' },
  'D14': { 'CG': 'aave', 'KK': 'AAVEUSD' },
  'D15': { 'CG': 'radicle', 'KK': 'RADUSD' },
  'D16': { 'CG': 'mantra-dao' },
  'D17': { 'CG': 'bzx-protocol' },
  'D18': { 'CG': 'ethereum-name-service', 'KK': 'ENSUSD' },
};

// CoinGecko API:
// https://www.coingecko.com/en/api#explore-api
// Coin id lookup here:
// https://api.coingecko.com/api/v3/coins/list
// Ex query:
// ex: https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,thegraph&vs_currencies=usd

function getPricesFromCoinGeckoApi(coinIds) {
  const _coinIds = Object.keys(cellToCoinIds).map((cell) => cellToCoinIds[cell].CG).join(',');
  const queryUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${_coinIds}&vs_currencies=usd`;
  const response = UrlFetchApp.fetch(queryUrl);
  const raw = response.getContentText();
  const data = JSON.parse(raw);
  return data;
}

function getCoinGeckoPrices() {
  const data = getPricesFromCoinGeckoApi();
  const sheet = SpreadsheetApp.getActiveSheet();
  Object.keys(cellToCoinIds).forEach((cell) => {
    const coinId = cellToCoinIds[cell].CG;
    if (coinId) {
      const coinData = data[coinId];
      const price = coinData ? coinData.usd : 'N/A';
      sheet.getRange(cell).setValue(price);
      if (price !== 'N/A') {
        Logger.log(cell + " " + coinId + " " + price);
        sheet.getRange(cell).setValue(price);
      }
    }
  });
};

// Use Kraken API:
// https://docs.kraken.com/rest/#tag/Market-Data/operation/getTickerInformation
// Query List of Assets:
// https://api.kraken.com/0/public/Assets
// Ex query: 
// https://api.kraken.com/0/public/Ticker?pair=ETHUSD,AAVEUSD


function getPricesFromKrakenApi(coinIds) {
  const _coinIds = Object.keys(cellToCoinIds)
    .filter((cell) => cellToCoinIds[cell].hasOwnProperty('KK'))
    .map((cell) => cellToCoinIds[cell].KK)
    .join(',');
  const queryUrl = `https://api.kraken.com/0/public/Ticker?pair=${_coinIds}`;
  const response = UrlFetchApp.fetch(queryUrl);
  const raw = response.getContentText();
  const data = JSON.parse(raw);
  return data.result;
}

function getKrakenPrices() {
  const data = getPricesFromKrakenApi();
  // Logger.log(data['XXBTZUSD']["b"][0]);
  const sheet = SpreadsheetApp.getActiveSheet();
  Object.keys(cellToCoinIds).forEach((cell) => {
    const coinId = cellToCoinIds[cell].KK;
    if (coinId) {
      const coinData = data[coinId]["b"][0]; // 'b' is bid price in format Bid [<price>, <whole lot volume>, <lot volume>]
      const price = coinData ? coinData : 'N/A';
      if (price !== 'N/A') {
        Logger.log(cell + " " + coinId + " " + price);
        sheet.getRange(cell).setValue(price);
      }
    }
  });
};
