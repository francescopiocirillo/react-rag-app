import { callOllamaRAGChatBot } from "@/lib/llmFunctions";

export async function POST(request) {
    const requestElaborated = await request.json();
    const response = await callOllamaRAGChatBot(requestElaborated.message);
    return Response.json({message: response});
}