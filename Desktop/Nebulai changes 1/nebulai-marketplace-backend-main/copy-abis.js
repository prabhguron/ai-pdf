const fs = require('fs');
const ABI_PATH = '../Nebulai_smart_contracts_MVP_v2/out';
const API_ABI_RELATIVE_PATH = './abi';
const DAPP_ABI_RELATIVE_PATH = '../nebulai-marketplace-v2/src/abi';

const contracts = ['Marketplace', 'MediationService', 'Whitelist', 'Court', 'USDTMock', 'NebulaiTestTokenFaucet', 'Escrow'];

fs.readdirSync(ABI_PATH).forEach(async(file) => {
    let contractName = file.split('.')[0] ?? '';
    if(contracts.includes(contractName)){
        const abiOutJson = fs.readFileSync(`${ABI_PATH}/${file}/${contractName}.json`, 'utf-8');
        const ABI = JSON.parse(abiOutJson)?.abi;

        if(contractName === 'USDTMock'){
            contractName = 'USDT';
        }
        
        fs.writeFileSync(`${API_ABI_RELATIVE_PATH}/${contractName}.json`, JSON.stringify(ABI, null, 2));
        fs.writeFileSync(`${DAPP_ABI_RELATIVE_PATH}/${contractName}.json`, JSON.stringify(ABI, null, 2));
        console.log(`Copied ${contractName} ABI 🎉`)
    }
});

console.log('--------------------------------');