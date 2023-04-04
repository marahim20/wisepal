import { ChatGPTMessage, OpenAIStream, OpenAIStreamPayload } from "@/utils/openAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

export default async function POST(req: Request): Promise<Response> {
  const { context } = (await req.json()) as {
    context?: ChatGPTMessage[]; // Change the expected input to an array of ChatGPTMessage objects
  };
  console.log("Printing context inside generate.ts: ", context);
  if (!context) {
    return new Response("No context in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: context, // Use the context variable as input
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}

