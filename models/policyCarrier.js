const mongoose = require("mongoose");

const policyCarrierSchema = new mongoose.Schema({
  company_name: { type: String },
});

const PolicyCarrier = mongoose.model("policy_carriers", policyCarrierSchema);
module.exports = PolicyCarrier;
