const mongoose = require('mongoose');

const arbitrationSchema = new mongoose.Schema({
  disputeID: {
    type: Number,
  },
  mediatorAddress: {
    type: String,
  },
  salt: {
    type: String,
  },
  vote: {
    type: Boolean,
  },
});

const Arbitration = mongoose.model('Arbitration', arbitrationSchema);

module.exports = Arbitration;
