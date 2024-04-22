import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export const ollamaChatModel = new ChatOllama({
  baseUrl: "http://localhost:11434", 
  model: "mistral",
});

const ollamaEmbeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  maxConcurrency: 5,
});

export const ollamaMemoryVectorStore = new MemoryVectorStore(ollamaEmbeddings);

const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
    [
        "user",
        "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
]);

const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        "Answer the user's questions based on the below context:\n\n{context}",
    ],
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
]);

export async function buildOllamaChain(ollamaChatModel, ollamaRetriever, historyAwarePrompt, historyAwareRetrievalPrompt) {
    const historyAwareRetrieverChain = await createHistoryAwareRetriever({
        llm: ollamaChatModel,
        retriever: ollamaRetriever,
        rephrasePrompt: historyAwarePrompt,
    });

    /** crea una chain che passa una lista di documenti ad un modello */
    const historyAwareCombineDocsChain = await createStuffDocumentsChain({
        llm: ollamaChatModel,
        prompt: historyAwareRetrievalPrompt, //il prompt serve a passare al modello i documenti sotto forma di context
    });
    
    const conversationalRetrievalChain = await createRetrievalChain({
        retriever: historyAwareRetrieverChain,
        combineDocsChain: historyAwareCombineDocsChain,
    });

    return conversationalRetrievalChain;
}