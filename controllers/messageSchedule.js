const schedule = require('node-schedule');
const Message = require('../models/messageScheduler');
const moment = require('moment-timezone'); // Install with npm install moment-timezone

async function messageScheduler(req, res) {
  try {
    const { message, day, time } = req.body;

    if (!message || !day || !time) {
      return res.status(400).json({ error: 'Message, day, and time are required' });
    }

    // Convert IST to UTC
    const istTime = moment.tz(`${day} ${time}`, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata');
    const scheduledDate = istTime.toDate(); // Convert to Date object

    if (isNaN(scheduledDate)) {
      return res.status(400).json({ error: 'Invalid date or time format' });
    }

    if (scheduledDate < new Date()) {
      return res.status(400).json({ error: 'Scheduled time must be in the future' });
    }

    // Schedule the message insertion
    schedule.scheduleJob(scheduledDate, async function () {
      const newMessage = new Message({ message, scheduledAt: scheduledDate, status: 'sent' });
      await newMessage.save();
      console.log(`Message Sent: ${message}`);
    });

    res.status(201).json({ message: 'Message scheduled successfully', scheduledAt: scheduledDate });

  } catch (error) {
    console.error('Error scheduling message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports.messageScheduler = messageScheduler;
