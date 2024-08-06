const ethers = require('ethers');
const ABI = require('../../../abi/AggregatorV3InterfaceABI.json');
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const cryptoDetails = require('./cryptoDetails.json');

async function cryptoPrice(cryptoName) {
  const priceFeed = new ethers.Contract(
    cryptoDetails[cryptoName].address,
    ABI,
    provider
  );
  const roundData = await priceFeed.latestRoundData();
  const price = roundData[1] / 10 ** cryptoDetails[cryptoName].decimals;
//   console.log('Latest Round Data:', `$${price}`);
  return price;
}


module.exports = { cryptoPrice };
