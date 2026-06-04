import { GoogleGenerativeAI, GenerativeModel, Tool, FunctionDeclaration } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  // We throw error during runtime if API_KEY is missing but allowing compilation
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Returns a Gemini model instance.
 */
export function getModel(modelName: string = "gemini-1.5-flash"): GenerativeModel {
  if (!genAI) {
    throw new Error("GOOGLE_API_KEY is not set in environment variables.");
  }
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Simple text-based chat helper.
 */
export async function simpleChat(prompt: string, modelName?: string): Promise<string> {
  const model = getModel(modelName);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export interface CallWithToolsOptions {
  modelName?: string;
  systemInstruction?: string;
  prompt: string;
  tools: FunctionDeclaration[];
  functions: Record<string, (...args: any[]) => Promise<any>>;
}

/**
 * Helper to call Gemini with tool definitions and automatically handle function calls.
 */
export async function callWithTools(options: CallWithToolsOptions): Promise<string> {
  const { modelName, systemInstruction, prompt, tools, functions } = options;
  const model = getModel(modelName);

  // Set system instruction if supported by the SDK version/model
  // In some SDK versions, systemInstruction is passed in getGenerativeModel
  
  const chat = model.startChat({
    tools: [{ functionDeclarations: tools }] as Tool[],
  });

  let result = await chat.sendMessage(prompt);
  let response = result.response;

  // Handle sequential function calls if any
  while (response.functionCalls()) {
    const functionCalls = response.functionCalls();
    if (!functionCalls) break;

    const functionResponses = await Promise.all(
      functionCalls.map(async (call) => {
        const fn = functions[call.name];
        if (!fn) {
          throw new Error(`Function ${call.name} not found in provided functions mapping.`);
        }
        const apiResponse = await fn(...Object.values(call.args));
        return {
          response: { name: call.name, content: apiResponse },
        };
      })
    );

    result = await chat.sendMessage(functionResponses);
    response = result.response;
  }

  return response.text();
}
