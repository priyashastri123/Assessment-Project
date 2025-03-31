const mongoose = require("mongoose");
// Define Mongoose Schema
const messageSchema = new mongoose.Schema({
    message: String,
    scheduledAt: Date,
    status: { type: String, enum: ['pending', 'sent'], default: 'pending' }
  });
  
  const Message = mongoose.model('scheduled_messages', messageSchema);

  module.exports = Message