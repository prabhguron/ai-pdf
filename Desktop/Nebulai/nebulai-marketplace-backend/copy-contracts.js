const fs = require('fs').promises;
const path = require('path');

const network = process.argv[2] ?? 'anvil';

const DEPLOYED_CONTRACTS_PATH = '../Nebulai_smart_contracts_MVP_v2/json_out';
const DAPP_ABI_RELATIVE_PATH = '../nebulai-marketplace-v2/src/abi';

async function updateContactJson(network){
    try {
        const deployedContracts = path.join(__dirname, DEPLOYED_CONTRACTS_PATH, 'deployedAddresses.json');
        const contractsJsonBackEnd = path.join(__dirname, 'abi', 'deployment.json');
        const contractsJsonDapp = path.join(__dirname, DAPP_ABI_RELATIVE_PATH, 'deployment.json');
        let deployedAddresses = await fs.readFile(deployedContracts, 'utf8');
        deployedAddresses = JSON.parse(deployedAddresses ?? []);
        if(deployedAddresses[network]){
            const newJson = {
                MEDIATION_SERVICE_CONTRACT: deployedAddresses[network].MediationService,
                WHITELIST_CONTRACT: deployedAddresses[network].Whitelist,
                MARKETPLACE_CONTRACT: deployedAddresses[network].Marketplace,
                NEB_TEST_TOKEN: deployedAddresses[network]['TestToken'] ?? ''
            }

            await fs.writeFile(contractsJsonBackEnd, JSON.stringify(newJson, null, 2));
            await fs.writeFile(contractsJsonDapp, JSON.stringify(newJson, null, 2));
            console.log(`Contract Addresses Synced 🎉`)
        }
    } catch (error) {
        console.error('Error reading file:', error?.message);
    }
}

updateContactJson(network);