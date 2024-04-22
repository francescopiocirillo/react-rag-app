import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { ollamaChatModel as chatModel } from "./utils";
import { ollamaEmbeddings } from "./utils";

const loader = new CheerioWebBaseLoader("https://docs.google.com/document/d/1OJhuvIg7KXAaWvKFY3M_kxxEybILAmWD8CtCsEB3HYI/edit?usp=sharing");
const docs = await loader.load();
//in questo modo splitDocs è un array che contiene tante piccole parti di docs
const splitter = new RecursiveCharacterTextSplitter();
const splitDocs = await splitter.splitDocuments(docs);

export const ollamaMemoryVectorStore = new MemoryVectorStore(ollamaEmbeddings);
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
