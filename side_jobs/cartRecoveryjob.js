const cron = require("node-cron");
const cartEvent = require("../models/cartEvent");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

//initializing the  GEMINI_API_KEY here
const GenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// we looking for product which action is just added_to_cart so we can email them to purchase.
const findAbandonedCarts = async () => {
  try {
    console.log("background job running: checking for abandoned carts");
    // In real project we mostly use 15 to 30 min but for testing we are using for 1 minute
    const timeLimit = new Date(Date.now() - 1 * 60 * 1000);

    //now we looking for abandoned carts which times is less than 1 min.
    const abandonedCarts = await cartEvent.find({
      action: "added_to_cart",
      createdAt: { $lt: timeLimit },
    });
    if (abandonedCarts.length > 0) {
      console.log(
        `alert:${abandonedCarts.length} abandoned cart(s) found! AI is writing emails...`,
      );
      //loop for every abandoned carts.
      for (const cart of abandonedCarts) {
        //we are using gemini-1.5-pro model
        const model = GenAI.getGenerativeModel({ model: "gemini-3.8-flash" });
        //just for context AI prompt
        const prompt = `You are an expert e-commerce sales copywriter. A user (${cart.userEmail}) added a "${cart.productName}" worth $${cart.price} to their cart but abandoned it. Write a short, highly persuasive 2-line email offering a 11% personalized discount to complete the purchase. Be polite and create a sense of urgency. Do not use subject lines, just the body text.`;
        //we getting response from AI here
        const result = await model.generateContent(prompt);
        const aiEmailContent = result.response.text();

        console.log(`\n AI generated Email draft for ${cart.userEmail}:`);
        console.log(aiEmailContent);
        console.log("-----------------------------------------------------");
        //just for testing we are printing on console
        // in real project we have to use nodemailer pkg which send text directly on email.

        cart.action = "email_sent"; //now status is changed.
        await cart.save();
        //changed has been save in DB"
      }
    } else {
      console.log("all good. No abandoned carts found right now.");
    }
  } catch (error) {
    console.error("error in background side_job:", error);
    console.error("Gemini error message:", error.message);
    console.error("Gemini status:", error.status);
    console.error("Gemini full error:", error);
  }
};
//cron side_job setup.
//for testing we have change 30 min (*/30 * * * *) to this (* * * *) every minute
cron.schedule("*/30 * * * *", () => {
  findAbandonedCarts();
});

console.log("cart Recovery cron side_job initialized.");
