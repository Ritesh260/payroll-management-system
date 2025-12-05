const Notification = require("../models/Notification");

async function sendNotification(userId, message) {
  try {
    await Notification.create({
      user: userId,
      message,
    });
  } catch (err) {
    console.log("Notification error:", err.message);
  }
}

module.exports = sendNotification;
