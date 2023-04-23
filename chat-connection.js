const io = require("socket.io-client");
const readline = require("readline");
const socket = io("http://localhost:8080");
const { Configuration, OpenAIApi } = require("openai");
const { logger } = require("./logger");
require("dotenv").config();

const apiKey = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

openai.apiKey = apiKey;

const message_history = [];
const initialPrompt = "You are Andrew an Customer Support agent, your task is to guide and help the user trought the system.";

async function generateResponse(message) {
  const newMessage = `\nUser Message: ${message}  \nCustomer Support(Andrew):`;
  const prompt = initialPrompt + message_history.join("") + newMessage;
  const currentTimeAndDate = new Date().toLocaleString();

  try {
    const completions = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 500,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      stop: ["(Andrew):"],
    });

    const response = completions.data.choices[0].text
      ? completions.data.choices[0].text
      : "Thanks for reaching out to us, we will get back to you soon.";

    message_history.push(prompt);
    message_history.push(response);
    logger("(" + currentTimeAndDate + ")" + "PROMPT:" + prompt + "\n" + "RESPONSE:" + response);
    return response;
  } catch (error) {
    console.error(error);
    logger("(" + currentTimeAndDate + ")" + "PROMPT: " + prompt + "ERROR:" + error);

    return "Sorry, I am having trouble generating a response right now. Please try again later.";
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

socket.on("message", async (data) => {
  if (data.user === "Bot") return;
  console.log(`(${data.user}) said:`, data.message);
  const response = await generateResponse(data.message);
  socket.emit("message", { user: "Bot", message: response });
});

const sendMessage = (message) => {
  if (message.trim()) {
    socket.emit("message", {
      user: socket.id,
      message: message,
    });
  }
};

// Read input from the terminal and send the message
const promptMessage = () => {
  rl.question("Enter message: ", (message) => {
    sendMessage(message);
    promptMessage();
  });
};

setTimeout(() => {
  try {
    promptMessage();
  } catch (err) {
    console.log(err);
    console.log("DEU RUIM");
  }
}, 1000);
