const User = require("../models/user");
const PolicyInfo = require("../models/policyInfo");

async function searchPolicyInfo(req, res) {
  try {
    let filter = {};

    if (req.body.searchStr) {
      filter.first_name = { $regex: req.body.searchStr, $options: "i" }; // Case-insensitive search
    }

    // Step 1: Fetch Users matching search criteria
    const users = await User.find(filter).select("_id first_name");

    if (users.length === 0) {
      return res.status(400).json({ message: `No data found for ${req.body.searchStr} user` });
    }

    const userIds = users.map((user) => user._id);

    // Step 2: Use aggregation to fetch policy details efficiently
    const policyInfoData = await PolicyInfo.aggregate([
      { $match: { user: { $in: userIds } } }, // Filter policies by user ID
      {
        $lookup: {
          from: "policy_carriers",
          localField: "company",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $lookup: {
          from: "policy_category_lobs",
          localField: "policy_category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$companyDetails" },
      { $unwind: "$categoryDetails" },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          policy_number: { $ifNull: ["$policy_number", ""] },
          policy_start_date: { $ifNull: ["$policy_start_date", ""] },
          policy_end_date: { $ifNull: ["$policy_end_date", ""] },
          policy_category: "$categoryDetails.category_name",
          company: "$companyDetails.company_name",
          user: "$userDetails.first_name",
          user_email: "$userDetails.email",
          user_phone: "$userDetails.phone_number",
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      data: policyInfoData,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports.searchPolicyInfo = searchPolicyInfo;
