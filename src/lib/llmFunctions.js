import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { chatHistory } from "./utils";
/*import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
*/
/** creazione oggetto ChatOllama, caratterizzata dall'url per raggiungere l'LLM e dal modello che si vuole utilizzare */





const chatModel = new ChatOllama({
  baseUrl: "http://localhost:11434", 
  model: "mistral",
});




/** caricamento documento di contesto */
//il documento docs sarà troppo grande per darlo direttamente all'LLM



const loader = new CheerioWebBaseLoader("https://docs.google.com/document/d/1OJhuvIg7KXAaWvKFY3M_kxxEybILAmWD8CtCsEB3HYI/edit?usp=sharing");
const docs = await loader.load();
//in questo modo splitDocs è un array che contiene tante piccole parti di docs
const splitter = new RecursiveCharacterTextSplitter();
const splitDocs = await splitter.splitDocuments(docs);
//console.log(splitDocs[0].pageContent.length);
/**
 * creazione embedding e vector store
 * https://thenewstack.io/the-building-blocks-of-llms-vectors-tokens-and-embeddings/#:~:text=Embeddings%20are%20high%2Ddimensional%20vectors,generation%2C%20sentiment%20analysis%20and%20more.
 */
const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  maxConcurrency: 5,
});
const vectorstore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings
);
const retriever = vectorstore.asRetriever();

/**
 * PARTE AGGIUNTIVA RISPETTO AL 4
 */

const historyAwarePrompt = ChatPromptTemplate.fromMessages([
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
  [
    "user",
    "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
  ],
]);

const historyAwareRetrieverChain = await createHistoryAwareRetriever({
  llm: chatModel,
  retriever: retriever,
  rephrasePrompt: historyAwarePrompt,
});


const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user's questions based on the below context:\n\n{context}",
  ],
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
]);

/** crea una chain che passa una lista di documenti ad un modello */
const historyAwareCombineDocsChain = await createStuffDocumentsChain({
  llm: chatModel,
  prompt: historyAwareRetrievalPrompt, //il prompt serve a passare al modello i documenti sotto forma di context
});

const conversationalRetrievalChain = await createRetrievalChain({
  retriever: historyAwareRetrieverChain,
  combineDocsChain: historyAwareCombineDocsChain,
});
/*
let result = await conversationalRetrievalChain.invoke({
  chat_history: chatHistory,
  input: "Where does he live?",
});

console.log("Secondo risultato:" + result.answer);
*/
console.log("hei");
/*
function mainLoop() {
    rl.question("Write: ", (userMessage) => {
        if(userMessage === "/stop") {
            rl.close();
        }
        else {
            chatHistory.push(new HumanMessage(userMessage));
            conversationalRetrievalChain.invoke({
                chat_history: chatHistory,
                input: userMessage,
              }).then((response) => {
                chatHistory.push(new AIMessage(response.answer));
                console.log("Response", response.answer);
                mainLoop();
              });
        }
    });
}
*/

/*
export function callLLMPersonalized(inputMessage) {
  conversationalRetrievalChain.invoke({
      chat_history: chatHistory,
      input: inputMessage,
  }).then((response) => {
      chatHistory.push(new AIMessage(response.answer));
      return response.answer;
  });
}*/

export function callLLMPersonalized(inputMessage) {
  return new Promise((resolve, reject) => {
    conversationalRetrievalChain.invoke({
      chat_history: chatHistory,
      input: inputMessage,
    }).then((response) => {
      chatHistory.push(new AIMessage(response.answer));
      resolve(response.answer);
    }).catch((error) => {
      reject(error);
    });
  });
}
