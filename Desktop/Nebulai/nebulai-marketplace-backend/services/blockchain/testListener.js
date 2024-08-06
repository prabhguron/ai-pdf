const ethers = require('ethers');

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
const signer = new ethers.Wallet(
  process.env.DEPLOYER_KEY,
  provider
);
const contract = new ethers.Contract(contractAddress, ABI, signer);

function eventListener() {
  contract.on('DataStored', (data1, data2, event) => {
    const emittedEvent = {
      data1,
      data2,
      DataStored: event.args,
    };
    console.log('DataStored:', emittedEvent);
  });
}

eventListener();

// async function listen() {
//   let events = await contract.queryFilter(contract.filters.ProjectCreated());
//   console.log(`Found ${events.length} past logs for ProjectCreated event`);
//   for (const event of events) {
//     const parsedEvent = contract.interface.parseLog(event);
//     const info = {
//       projectId: parsedEvent.args.projectId,
//       buyer: parsedEvent.args.buyer,
//       provider: parsedEvent.args.provider,
//       //   data: event,
//     };
//     console.log(info);
//   }
// }

// listen();