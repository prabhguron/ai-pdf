const NFTStorageService = require('./NFTStorageService');

const ipfsServiceFactory = {
  createIPFSService: function (type) {
    switch (type) {
      case 'nftstorage':
        return new NFTStorageService();
      default:
        throw new Error(`Invalid service type: ${type}`);
    }
  },
};

class IPFSService {
  constructor(ipfsServiceFactory) {
    this.ipfsServiceFactory = ipfsServiceFactory;
  }
  async uploadToIPFS(metadata) {
    const ipfsService = this.ipfsServiceFactory.createIPFSService(
      process.env.IPFS_SERVICE
    );
    return ipfsService.uploadToIPFS(metadata);
  }

  async retrieveMetadata(metadataCID) {
    const ipfsService = this.ipfsServiceFactory.createIPFSService(
      process.env.IPFS_SERVICE
    );
    return ipfsService.retrieveMetadata(metadataCID);
  }
}

module.exports = new IPFSService(ipfsServiceFactory);
