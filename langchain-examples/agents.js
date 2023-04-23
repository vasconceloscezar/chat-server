require("dotenv").config();

const { PromptTemplate } = require("langchain/prompts");
const { OpenAI } = require("langchain/llms/openai");
const { LLMChain } = require("langchain/chains");

const { SerpAPI } = require("langchain/tools");
const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { Calculator } = require("langchain/tools/calculator");

const apiKey = process.env.OPENAI_API_KEY;
const serpApiKey = process.env.SERP_API_KEY;
const modelConfig = { openAIApiKey: apiKey, temperature: 0.9 };

async function main() {
  const model = new OpenAI(modelConfig);

  const searchTool = new SerpAPI(serpApiKey, {
    location: "Venâncio Aires, Rio Grande do Sul, Brazil",
    hl: "pt-BR",
    gl: "br",
  });
  const calculatorTool = new Calculator();

  const tools = [searchTool, calculatorTool];

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "zero-shot-react-description",
  });
  console.log("Agent loaded.");

  const input = "Quem é o prefeito?" + " Qual a temperatura atual, multiplicando por 2?";
  console.log("Executing with input: ", input);
  const result = await executor.call({ input });

  console.log("Result: ", result.output);
}

setTimeout(() => {
  try {
    main();
  } catch (err) {
    console.log(err);
    console.log("DEU RUIM");
  }
}, 1000);
