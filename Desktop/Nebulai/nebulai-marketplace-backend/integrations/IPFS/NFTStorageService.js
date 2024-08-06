const { NFTStorage, Blob } = require('nft.storage');
const { create } = require('ipfs-http-client');

const ipfs = create();

class NFTStorageService {
  client = null
  constructor() {
    this.client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });
  }

  async uploadToIPFS(metadata) {
    try {
      const blob = new Blob([JSON.stringify(metadata)]);
      const metadataCID = await this.client.storeBlob(blob);
      return metadataCID;
    } catch (e) {
      console.error('uploadToIPFS |ERROR| ',e.message);
    }
  }

  async retrieveMetadata(metadataCID) {
    try {
      const data = await ipfs.cat(metadataCID);
      const content = [];
      for await (const chunk of data) {
        content.push(chunk);
      }
      const metadata = JSON.parse(content.toString());
      return metadata;
    } catch (e) {
      console.error('retrieveMetadata |ERROR| ', e.message);
    }
  }
}

module.exports = NFTStorageService;
