const mongoose = require("mongoose");

const cartEventSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    action: {
      type: String,
      enum: ["viewed", "added_to_cart", "purchased", "email_sent"],
      required: true,
    },
    recoveryEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("cartEvent", cartEventSchema);
