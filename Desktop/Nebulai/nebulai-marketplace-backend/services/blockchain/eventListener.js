const ethers = require('ethers');
const User = require('../../models/userModel');
const MailService = require('../../integrations/Mailer/MailService');

// const ABI = require('../../abi/Marketplace.json');
// const { CONTRACTS } = require('../../utils/contants');

// const contractAddress = CONTRACTS['MARKETPLACE'];
// const provider = new ethers.providers.WebSocketProvider(
//   process.env.WSS_URL
// );
// const signer = new ethers.Wallet(
//   process.env.DEPLOYER_KEY,
//   provider
// );
// const contract = new ethers.Contract(contractAddress, ABI, signer);

// function eventListener() {
//   contract.on('ProjectCreated', (projectId, buyer, provider, event) => {
//     console.log('ProjectCreated event emitted:');
//     const newProject = {
//       projectId,
//       buyer,
//       provider,
//     };
//     console.log(newProject);
//     // console.log('ProjectId:', event.args.projectId);
//     // console.log('Buyer:', event.args.buyer);
//     // console.log('Provider:', event.args.provider);
//   });
// }

// module.exports = { eventListener };

const ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'data1',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'data2',
        type: 'uint256',
      },
    ],
    name: 'DataStored',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_data1',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_data2',
        type: 'uint256',
      },
    ],
    name: 'storeData',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const contractAddress = '0xc46f5B5653ac7016a4eF995A2a146A9CCcF0628e';
const provider = new ethers.providers.WebSocketProvider(
  process.env.WSS_URL
);
const signer = new ethers.Wallet(process.env.DEPLOYER_KEY, provider);
const contract = new ethers.Contract(contractAddress, ABI, signer);

function eventListener() {
  contract.on('DataStored', async (data1, data2, event) => {
    const emittedEvent = {
      data1,
      data2,
      DataStored: event.args,
    };
    // console.log('DataStored:', emittedEvent);
    let talent = '0x09E3bc27c6ac12741Ade23F6A1FE21B70E353e8A';
    let org = '0x1E85A388D712f9F3371f107F050C114dd78c9735';

    let talentProfile = await User.findOne(
      { linkedWallets: talent },
      { _id: 0, email: 1 }
    );
    let orgProfile = await User.findOne(
      { linkedWallets: org },
      { _id: 0, email: 1 }
    );
    let sentToTalent = await MailService.sendEmail({
      to: talentProfile.email,
      templateId: process.env.PROJECT_CREATED_TEMPLATE_ID,
      hideWarnings: true,
    });
    let sentToOrg = await MailService.sendEmail({
      to: orgProfile.email,
      templateId: process.env.PROJECT_CREATED_TEMPLATE_ID,
      hideWarnings: true,
    });
    console.log(sentToTalent, sentToOrg);
  });
}

module.exports = { eventListener };
