const { NFTStorage, Blob } = require('nft.storage');
const { create } = require('ipfs-http-client');
// const client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });
const client = new NFTStorage({
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk0MzBFQWJGZmYwMUJGNTYxQTc5MkQ4NjgyNjJCRkUxMjcyM2MwNkIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4OTgyNzI0MDM5MiwibmFtZSI6Im5lYnVsYWktc21hcnQtY29udHJhY3RzIn0.ODk0CFL7Kq52T9HIdVoXxEXqclAxNQNH3tzcT84yCXg',
});
const ipfs = create();

const metadata = {
  name: 'Pinpie',
  description: 'Pin is not delicious beef!',
};

const blob = new Blob([JSON.stringify(metadata)]);
let metadataCID;

async function uploadToIPFS() {
  metadataCID = await client.storeBlob(blob);
  console.log('Metadata stored successfully:', metadataCID);
}

async function retrieveMetadata(metadataCID) {
  try {
    const data = await ipfs.cat(metadataCID);
    const content = [];
    for await (const chunk of data) {
      content.push(chunk);
    }
    const metadata = JSON.parse(content.toString());
    console.log('Retrieved metadata:', metadata);
  } catch (error) {
    console.error('Failed to retrieve metadata:', error);
  }
}

uploadToIPFS();
retrieveMetadata(metadataCID);
