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
import { PDFLoader } from "langchain/document_loaders/fs/pdf"; //npm install pdf-parse
//const chatHistory = [new HumanMessage("I am a Doctor"), new AIMessage("I will help you to the best of my abilities!")];
/**
 * Oggetto ChatOllama
 */
const chatModel = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "mistral",
});

/**
 * Creazione embedding e Vector Store
 * https://thenewstack.io/the-building-blocks-of-llms-vectors-tokens-and-embeddings/#:~:text=Embeddings%20are%20high%2Ddimensional%20vectors,generation%2C%20sentiment%20analysis%20and%20more.
 */
const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  maxConcurrency: 5,
});
const vectorstore = new MemoryVectorStore(embeddings);
const retriever = vectorstore.asRetriever();

/**
 * Prompt che permette di generare la query di ricerca nel 
 * Vector Store
 */
const historyAwarePrompt = ChatPromptTemplate.fromMessages([
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
  [
    "user",
    "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
  ],
]);

/**
 * Chain che usando l'LLM e il prompt forniti effettua una ricerca
 * nel Vector Store associato al retriever passato
 */
const historyAwareRetrieverChain = await createHistoryAwareRetriever({
  llm: chatModel,
  retriever: retriever,
  rephrasePrompt: historyAwarePrompt,
});

/**
 * Prompt che istruisce l'LLM a generare una risposta basandosi
 * sull'input dell'utente, sulla cronologia della conversazione e
 * sul contesto prelevato dal Vector Store
 */
const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user's questions based on the context and the previous messages, try to be brief:\n\n{context}",
  ],
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
]);

/**
 * Chain che combina il prompt "history and context aware "e il chat model
 */
const historyAwareCombineDocsChain = await createStuffDocumentsChain({
  llm: chatModel,
  prompt: historyAwareRetrievalPrompt,
});

/**
 * Chain che combina la parte conversazionale
 * alla parte di recupero del contesto
 */
const conversationalRetrievalChain = await createRetrievalChain({
  retriever: historyAwareRetrieverChain,
  combineDocsChain: historyAwareCombineDocsChain,
});

/**
 * Funzione che permette di aggiungere un documento
 * dal web al Vector Store
 * @param {String} url 
 */
export function addFileSourceFromWeb(url) {
  return new Promise((resolve, reject) => {
    console.log("Ingresso funzione");
    const loader = new CheerioWebBaseLoader(url);
    loader.load()
      .then((docs) => {
        const splitter = new RecursiveCharacterTextSplitter();
        splitter.splitDocuments(docs)
          .then((splitDocs) => {
            vectorstore.addDocuments(splitDocs)
              .then(() => {
                // Success
                console.log("success");
                resolve("Caricato con successo");
              })
          })
      })
      .catch((e) => {
        console.log("file not found");
      });
  });
}

/**
 * Funzione che permette di aggiungere un PDF
 * al Vector Store
 * @param {String} path 
 */
function addPDFSource(path) {
  const loader = new PDFLoader(path);
  loader.load()
    .then((docs) => {
      const splitter = new RecursiveCharacterTextSplitter();
      splitter.splitDocuments(docs)
        .then((splitDocs) => {
          vectorstore.addDocuments(splitDocs)
            .then(() => {
              console.log("Success");
            })
            .catch((e) => {
              console.log("add documents failed");
            });
        })
        .catch((e) => {
          console.log("Split documents failed");
        });
    })
    .catch((e) => {
      console.log("file not found");
    });
}
await addFileSourceFromWeb("https://docs.google.com/document/d/1OJhuvIg7KXAaWvKFY3M_kxxEybILAmWD8CtCsEB3HYI/edit?usp=sharing");
/**
 * Funzione che permette di invocare la chain
 * su un input fornito dall'utente
 * @param {String} inputMessage 
 * @returns la risposta dell'LLM
 */
export function callOllamaRAGChatBot(inputMessage) {
  //addFileSourceFromWeb("https://docs.google.com/document/d/1OJhuvIg7KXAaWvKFY3M_kxxEybILAmWD8CtCsEB3HYI/edit?usp=sharing");
  //addPDFSource("./docs/Documento1.pdf");
  return new Promise((resolve, reject) => {
    console.log("Invocazione");
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

/*addFileSourceFromWeb("https://docs.google.com/document/d/1OJhuvIg7KXAaWvKFY3M_kxxEybILAmWD8CtCsEB3HYI/edit?usp=sharing")
  .then((res) => {
    return callOllamaRAGChatBot("Who is Luna?")
  })
  .then(console.log);
*/