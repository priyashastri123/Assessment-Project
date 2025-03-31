const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  account_name: { type: String},
});

const UserAccount = mongoose.model("user_accounts", accountSchema);
module.exports = UserAccount;
