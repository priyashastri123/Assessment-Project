const express = require("express");
const router = express.Router();
const searchPolicyInfoController = require("../controllers/searchPolicyInfo");
const messageScheduleController = require("../controllers/messageSchedule");
const uploadFileDataController = require("../controllers/uploadData");
const aggregatedPolicyController  = require("../controllers/aggregatedPolicy");
const multer = require("multer");

// Use memoryStorage for storing files in memory (useful for small files or when you need to process the file in memory)
const diskStorage = multer.memoryStorage();
const uploadService = multer({
  storage: diskStorage,
});

router.get("/ping", (req, res) => {
    res.json({ message: "Pong" });
});

router.get("/", (req, res) => {
    res.send("Server is running and monitoring CPU usage...");
});


router.post("/uploadFileDataInCollections",uploadService.single("file"),(req, res) => {
    uploadFileDataController.uploadFileDataInCollections(req, res);
  }
);

router.post("/searchPolicyInfo", (req, res) => {
  searchPolicyInfoController.searchPolicyInfo(req, res);
});
router.post("/policies/aggregate", async (req, res) => {
   aggregatedPolicyController.aggregatedPolicy(req,res);
});

router.post("/schedule-message", async (req, res) => {
  messageScheduleController.messageScheduler(req, res);
});

module.exports = router;
