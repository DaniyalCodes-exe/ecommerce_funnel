const express = require("express");
const router = express.Router();
const cartEventController = require("../controllers/cartEventController");

router.post("/track-event", cartEventController.trackEvent);

router.get("/funnel-stats", cartEventController.getFunnelStats);

module.exports = router;
