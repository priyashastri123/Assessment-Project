const Agent = require('../models/agent');
const User = require('../models/user');
const UserAccount = require('../models/userAccount');
const PolicyCategory = require('../models/policyCategory');
const PolicyCarrier = require('../models/policyCarrier');
const PolicyInfo = require('../models/policyInfo');


async function aggregatedPolicy(req,res){
    try {
        const aggregatedPolicies = await PolicyInfo.aggregate([
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
    
        res.json({ success: "Success", data: aggregatedPolicies });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: "Failed", message: "Internal Server Error" });
      }
}

module.exports.aggregatedPolicy = aggregatedPolicy