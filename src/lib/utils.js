import { HumanMessage, AIMessage } from "@langchain/core/messages";

export const chatHistory =  [new HumanMessage("Ciao"), new AIMessage("NO")];

export function scrollToBottom(containerRef) {
  if (containerRef.current) {
    const lastMessage = containerRef.current.lastElementChild;
    if (lastMessage) {
      const scrollOptions = {
        behavior: "smooth",
        block: "end",
      };
      lastMessage.scrollIntoView(scrollOptions);
    }
  }
}
