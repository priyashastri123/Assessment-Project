const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const Agent = require('../models/agent');
const User = require('../models/user');
const UserAccount = require('../models/userAccount');
const PolicyCategory = require('../models/policyCategory');
const PolicyCarrier = require('../models/policyCarrier');
const PolicyInfo = require('../models/policyInfo');
const connectDB = require('../connection/db'); // Import database connection function

if (isMainThread) {
    async function uploadFileDataInCollections(req, res) {
        try {
            let file = req.file;
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const workbook = xlsx.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(sheet);

            const worker = new Worker(__filename, { workerData: jsonData });

            worker.on('message', (result) => {
                if (result.success) {
                    res.json({ message: 'Excel Data saved successfully', status: "Success" });
                } else {
                    res.status(400).json({ message: 'Failed to save Excel Data', status: "Failed" });
                }
            });

            worker.on('error', (err) => {
                console.error('Worker error:', err);
                res.status(500).json({ error: err.message });
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    module.exports.uploadFileDataInCollections = uploadFileDataInCollections;
} else {
    async function insertDataInCollections(dataArray) {
        try {
            let count = 0;
            for (const data of dataArray) {
                let agent = await Agent.findOneAndUpdate(
                    { agent_name: data.agent },
                    { agent_name: data.agent },
                    { upsert: true, new: true }
                );

                let user = await User.findOneAndUpdate(
                    { email: data.email },
                    {
                        first_name: data.firstname,
                        dob: convertExcelDateToJSDate(data.dob),
                        address: data.address,
                        phone_number: data.phone,
                        state: data.state,
                        zip: data.zip,
                        email: data.email,
                        gender: null,
                        user_type: data.userType
                    },
                    { upsert: true, new: true }
                );

                let userAccount = await UserAccount.findOneAndUpdate(
                    { account_name: data.account_name },
                    { account_name: data.account_name },
                    { upsert: true, new: true }
                );

                let policyCategory = await PolicyCategory.findOneAndUpdate(
                    { category_name: data.category_name },
                    { category_name: data.category_name },
                    { upsert: true, new: true }
                );

                let policyCarrier = await PolicyCarrier.findOneAndUpdate(
                    { company_name: data.company_name },
                    { company_name: data.company_name },
                    { upsert: true, new: true }
                );

                let policyInfoData = await PolicyInfo.findOneAndUpdate(
                    { policy_number: data.policy_number },
                    {
                        policy_number: data.policy_number,
                        policy_start_date: convertExcelDateToJSDate(data.policy_start_date),
                        policy_end_date: convertExcelDateToJSDate(data.policy_end_date),
                        policy_category: policyCategory._id,
                        company: policyCarrier._id,
                        user: user._id
                    },
                    { upsert: true, new: true }
                );

                if (policyInfoData._doc || agent._doc || user._doc || userAccount._doc || policyCategory._doc ||policyCarrier._doc) {
                    console.log(`data inserted or updated for ${user._doc.first_name} user`);
                    
                    count++;
                }
            }
            return count === dataArray.length;
        } catch (error) {
            console.error('Error inserting policy data:', error);
            return false;
        }
    }

    function convertExcelDateToJSDate(excelDate) {
        return new Date((excelDate - 25569) * 86400 * 1000);
    }

    connectDB().then(() => {
        insertDataInCollections(workerData).then((success) => {
            parentPort.postMessage({ success });
        }).catch((error) => {
            parentPort.postMessage({ success: false, error: error.message });
        });
    }).catch((error) => {
        console.error("Error connecting to MongoDB in worker thread:", error);
        parentPort.postMessage({ success: false, error: error.message });
    });
}
