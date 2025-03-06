const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const usedTokenSchema = new Schema({
    token: { type: String },
    email: { type: String }
});

module.exports = mongoose.model('UsedTokens', usedTokenSchema);