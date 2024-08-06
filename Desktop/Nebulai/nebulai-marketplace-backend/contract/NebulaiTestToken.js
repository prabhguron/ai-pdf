const ethers = require("ethers");

const ABI = require("../abi/NebulaiTestTokenFaucet.json");
const { CONTRACTS } = require("../utils/constants");

const contractAddress = CONTRACTS.NEB_TEST_TOKEN;
const contract = null;
if(contractAddress.length){
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
    const signer = new ethers.Wallet(process.env.DEPLOYER_KEY, provider);
    contract = new ethers.Contract(contractAddress.length ? contractAddress :ethers.constants.AddressZero, ABI, signer);
}

const mintFaucet = async (toAddress, amount) =>{
    if(!contractAddress.length || !contract) return null;
    try {
        const txn = await contract.mint(toAddress, amount);
        if(txn){
            return txn.hash;
        }
    } catch (error) {
        console.log(error?.message);
    }
    return null;
}


module.exports = {
    mintFaucet
}