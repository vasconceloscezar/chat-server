require("dotenv").config();

const { BufferMemory } = require("langchain/memory");
const { ConversationChain } = require("langchain/chains");
const { OpenAI } = require("langchain/llms/openai");

const apiKey = process.env.OPENAI_API_KEY;
const modelConfig = { openAIApiKey: apiKey, temperature: 0.9 };

async function main() {
  const model = new OpenAI(modelConfig);
  const memory = new BufferMemory();
  const chain = new ConversationChain({ llm: model, memory: memory });
  const res1 = await chain.call({ input: "Hi! I'm Cezar." });
  console.log(res1);
  const res2 = await chain.call({ input: "What's my name?" });
  console.log(res2);
}

setTimeout(() => {
  try {
    main();
  } catch (err) {
    console.log(err);
  }
}, 1000);
