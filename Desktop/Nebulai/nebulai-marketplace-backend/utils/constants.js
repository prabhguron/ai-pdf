const contracts = require('../abi/deployment.json');
module.exports = {
  ROLES: {
    admin: 0,
    talent: 1,
    company: 2,
    solutionProvider: 3,
    investor: 4,
  },
  APPLICATION_STATUS:{
    PENDING: 'pending',
    SHORTLISTED: 'shortlisted',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
  },
  OFFER_STATUS:{
    OFFERED: 'offered',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },
  CONTRACTS: {
    MARKETPLACE: contracts.MARKETPLACE_CONTRACT,
    WHITELIST: contracts.WHITELIST_CONTRACT,
    NEB_TEST_TOKEN: contracts.NEB_TEST_TOKEN
  },
  ON_BOARDING: 'onboarding',
  KYC_RETRY_DOCS: 'retry',
  DUMMY_PROJECT_IPFS_HASH: 'bafkreiezhktvgveouooljs5chjxs4kpx4gww3l5qbtfovveafpxbsnyh7y',
  DUMMY_CHANGE_ORDER_IPFS_HASH:'bafkreibkbxwdotk2p3p2pka3s25eifaowdc5bdulmq6b6fqyydazlqnjw4',
  COMPANY_SIZE_OPTIONS :{
    1: "1-10 employees",
    2: "11-50 employees",
    3: "51-200 employees",
    4: "201-500 employees",
    5: "501-1000 employees",
    6: "1001-5000 employees",
    7: "5001-10,000 employees",
    8: "10,000+ employees",
  }
};