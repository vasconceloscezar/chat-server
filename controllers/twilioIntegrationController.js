// Import required libraries and modules
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const axios = require("axios");

// Set up the express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

exports.whatsAppMessage = async (req, res) => {
  // Define the webhook endpoint for WhatsApp
  try {
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(twilioSid, twilioAuthToken);

    // Extract the message details from the request body
    const message = req.body.Body;
    const sender = req.body.From;

    // Check if the message contains any specific trigger words
    if (message.includes("trigger_1")) {
      // Send a message to a specific WhatsApp number using the Twilio API
      client.messages
        .create({
          body: message,
          to: "+5551997285829",
        })
        .then((message) => console.log(message.sid))
        .done();

      // const response = await client.messages.create({
      //   from: "whatsapp:+16073182294",
      //   body: "Message sent in response to trigger word 1: " + message,
      //   to: "whatsapp:+5551997285829",
      // });
    } else if (message.includes("trigger_2")) {
      // Send a message to a specific WhatsApp number using the WhatsApp Business API
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        {
          Body: "Message sent in response to trigger word 2" + message,
          From: "whatsapp:+16073182294",
          To: "whatsapp:+5551997285829",
        },
        {
          auth: {
            username: twilioSid,
            password: twilioAuthToken,
          },
        }
      );
    }

    // Return a success response to the webhook
    res.status(200).end();
  } catch (error) {
    console.error(error);
    // Return an error response to the webhook
    res.status(500).end();
  }
};
