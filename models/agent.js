const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  agent_name: { type: String},
});

const Agent = mongoose.model("agents", agentSchema);
module.exports = Agent;
