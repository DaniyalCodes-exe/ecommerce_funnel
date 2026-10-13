const cartEvent = require("../models/cartEvent");

exports.trackEvent = async function (req, res) {
  try {
    const { userEmail, productName, price, action } = req.body;

    if (!userEmail || !productName || price == null || !action) {
      return res.status(400).json({
        message: "please provide all the required fields.",
      });
    }
    const newEvent = new cartEvent({
      userEmail,
      productName,
      price,
      action,
    });
    await newEvent.save();

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("error in tracking event:", error);
    res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};

exports.getFunnelStats = async (req, res) => {
  try {
    const stats = await cartEvent.aggregate([
      {
        $group: {
          _id: "$action",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({ funnelStats: stats });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};
