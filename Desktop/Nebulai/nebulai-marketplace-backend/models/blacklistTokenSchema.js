const mongoose = require('mongoose');

const BlacklistTokenSchema = new mongoose.Schema({
  token: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // expires in 1 hour
});

const BlacklistToken = mongoose.model('BlacklistToken', BlacklistTokenSchema);

module.exports = BlacklistToken;
