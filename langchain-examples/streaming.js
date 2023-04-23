require("dotenv").config();

const { BufferMemory } = require("langchain/memory");
const { ConversationChain } = require("langchain/chains");
const { OpenAI } = require("langchain/llms/openai");

const apiKey = process.env.OPENAI_API_KEY;
const modelConfig = {
  openAIApiKey: apiKey,
  temperature: 0.9,
  streaming: true,
  callbacks: [
    {
      handleLLMNewToken(token) {
        process.stdout.write(token);
      },
    },
  ],
};

async function main() {
  const model = new OpenAI(modelConfig);

  await model.call("Escreva um poema sobre um gato.");
}

setTimeout(() => {
  try {
    main();
  } catch (err) {
    console.log(err);
  }
}, 1000);
