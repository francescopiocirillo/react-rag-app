import { callLLMPersonalized } from "@/lib/llmFunctions";

export async function POST(request) {
    const requestElaborated = await request.json();
    const response = await callLLMPersonalized(requestElaborated.message);
    return Response.json({message: response});
}