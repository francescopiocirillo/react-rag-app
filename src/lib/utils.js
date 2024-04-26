import { HumanMessage, AIMessage } from "@langchain/core/messages";

export const chatHistory = [new HumanMessage("I am a Doctor"), new AIMessage("I will help you to the best of my abilities!")];

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
