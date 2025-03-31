const mongoose = require("mongoose");

const policyCategorySchema = new mongoose.Schema({
  category_name: { type: String },
});

const PolicyCategory = mongoose.model("policy_category_lobs", policyCategorySchema);
module.exports = PolicyCategory;
