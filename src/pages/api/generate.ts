import { ChatGPTMessage, OpenAIStream, OpenAIStreamPayload } from "@/utils/openAIStream";
import systemMessages from './systemMessages';

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

export default async function POST(req: Request): Promise<Response> {
  const { context, category } = (await req.json()) as {
    context?: ChatGPTMessage[]; // Change the expected input to an array of ChatGPTMessage objects
    category?: string;
  };

  if (!context) {
    return new Response("No context in the request", { status: 400 });
  }
  if (!category) {
    return new Response("No category in the request", { status: 400 });
  }

  var temperature;
  var newContext;

  // iterate thorugh the systemMessages object and check if the category matches the key
  // if it does, set the temperature to 0.0 and set the newContext to the value of the key

  for (var i = 0; i < systemMessages.length; i++) {
    if (category === systemMessages[i].category) {
      temperature = systemMessages[i].temperature as number;
      const sysMes = {role: "system", content: systemMessages[i].message} as ChatGPTMessage;
      newContext = [sysMes, ...context];
    }
  }

  // always check if the newContext and temperature is undefined 
  // if wrong category is passed in the url or if the category is not in the systemMessages object 
  // set the temperature to 0.5 and set the newContext to the context variable
  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: newContext == undefined ? context : newContext, // Use the context variable as input
    temperature: temperature == undefined ? 0.5 : temperature,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };
  // console.log("Printing context inside generate.ts: ", newContext);

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}

