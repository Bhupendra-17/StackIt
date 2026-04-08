const mongoose = require("mongoose");
const Notification = require("../models/Notification");

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid notification id" });
    }

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    notification.read = true;
    await notification.save();

    res.json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (err) {
    next(err);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true },
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
      updatedCount: result.modifiedCount || 0,
    });
  } catch (err) {
    next(err);
  }
};

