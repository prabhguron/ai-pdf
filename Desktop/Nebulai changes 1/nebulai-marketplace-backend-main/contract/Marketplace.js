const ethers = require("ethers");

const ABI = require("../abi/Marketplace.json");
const ERC20_ABI = require("../abi/USDT.json");
const { CONTRACTS } = require("../utils/constants");

const contractAddress = CONTRACTS['MARKETPLACE'];
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const signer = new ethers.Wallet(process.env.DEPLOYER_KEY, provider);

const contract = new ethers.Contract(contractAddress, ABI, signer);


const calculateNebulaiTxFee = async (projectFee, paymentToken) =>{
    try {
        const txFee = await contract.calculateNebulaiTxFee(projectFee, paymentToken);
        if(txFee){
            return txFee;
        }
    } catch (error) {
        console.log(error?.message);
    }
    return null;
}

const getErc20Tokens = async()=>{
    try {
        const tokens = await contract.getErc20Tokens();
        if(tokens.length){
            let tokenMap = {};
            await Promise.all(tokens.map(async (token) => {
                const tokenContract = new ethers.Contract(token, ERC20_ABI, signer);
                const symbol = await tokenContract.symbol();
                tokenMap[symbol] = token;
            }));
            return tokenMap;
        }
    } catch (error) {
        console.log(error?.message);
    }
    return null;
}


module.exports = {
    calculateNebulaiTxFee,
    getErc20Tokens
}