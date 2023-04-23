require("dotenv").config();

const { PromptTemplate } = require("langchain/prompts");
const { OpenAI } = require("langchain/llms/openai");
const { LLMChain } = require("langchain/chains");

const apiKey = process.env.OPENAI_API_KEY;

const modelConfig = { openAIApiKey: apiKey, temperature: 0.9 };

async function main() {
  const model = new OpenAI(modelConfig);

  const template = "What is the best name for a company that makes {product}?";

  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ["product"],
  });

  const chain = new LLMChain({ llm: model, prompt: prompt });

  const res = await chain.call({ product: "cars" });
  console.log(res);
}

setTimeout(() => {
  try {
    main();
  } catch (err) {
    console.log(err);
    console.log("DEU RUIM");
  }
}, 1000);
