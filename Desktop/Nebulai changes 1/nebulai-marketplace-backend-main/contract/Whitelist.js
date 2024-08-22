const ethers = require("ethers");

const ABI = require("../abi/Whitelist.json");
const { CONTRACTS } = require("../utils/constants");

const contractAddress = CONTRACTS['WHITELIST'];
console.log('WHITELIST', contractAddress);
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const signer = new ethers.Wallet(process.env.DEPLOYER_KEY, provider);

const contract = new ethers.Contract(contractAddress, ABI, signer);


const approveAddress = async (address) =>{
    console.log('approveAddress - approving', address);
    try {
        const gasPrice = await provider.getGasPrice();
        const txn = await contract.approveAddress(address,{
            gasPrice
        });
        if(txn){
            return txn.hash;
        }
    } catch (error) {
        console.error('approveAddress: ERROR: ',error?.message);
    }
    return null;
}

const revokeApproval = async (address) =>{
    try {
        const gasPrice = await provider.getGasPrice();
        const txn = await contract.revokeApproval(address,{
            gasPrice
        });
        if(txn){
            return txn.hash;
        }
    } catch (error) {
       console.log('revokeApproval: ERROR: ',error?.message);
    }
    return null;
}

const isApproved = async (address) =>{
    if(!address) return false;
    try {
        const approved = await contract.isApproved(address);
        return approved;
    } catch (error) {
        console.log(error?.message);
    }
    return false;
}


module.exports = {
    approveAddress,
    revokeApproval,
    isApproved
}