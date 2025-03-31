const mongoose = require("mongoose");

const policyInfoSchema = new mongoose.Schema({
  policy_number: { type: String,unique: true },
  policy_start_date: { type: Date },
  policy_end_date: { type: Date },
  policy_category: { type: mongoose.Schema.Types.ObjectId, ref: "policy_category_lobs" },
  company : { type: mongoose.Schema.Types.ObjectId, ref: "policy_carriers" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const policyInfo = mongoose.model("policy_infos", policyInfoSchema);
module.exports = policyInfo;
