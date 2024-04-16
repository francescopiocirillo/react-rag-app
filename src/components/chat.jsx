'use client';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea, Stack } from '@mui/material';
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import ChatLine from "@/components/chat-line";
import { chatHistory } from '@/lib/utils';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { scrollToBottom } from '@/lib/utils';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function Chat() {

  const [history, setHistory] = useState(chatHistory);
  const [inputMessage, setInputMessage] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    // This effect will run whenever history changes
    //console.log("effetto");
    scrollToBottom(containerRef);
  }, [JSON.stringify(history)]); //or `${outcomes}`, just putting history doesn't work because the array remains the same
  
  const sendMessage = () => {
    const newQuestionHistory = [...history];
    const userInput = inputMessage;
    newQuestionHistory.push(new HumanMessage(userInput));
    setHistory(newQuestionHistory);
    setInputMessage("");
    fetch("http://localhost:3000/api/answer", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body: JSON.stringify({message: userInput}),
    })
      .then(response => response.json())
      .then(json => {
        console.log('parsed json', json);
        const newAnswerHistory = [...newQuestionHistory];
        newAnswerHistory.push(new AIMessage(json.message));
        setHistory(newAnswerHistory);
      });
  }

  let i = 0;
  return (
    <Stack>
      <Stack ref={containerRef} style={{maxHeight: 450, overflow: "auto"}}>
        {history.map((singleMessage) => (
        <ChatLine
          /* ci vorrebbe il prop key che identifica univocamente gli elementi della lista */
          key={i++}
          message={singleMessage}
        />))}
      </Stack>
      <form>
          <Stack spacing={2} direction="row" style={{borderColor: "gray", border: "solid"}}>
              <TextField id="outlined-basic" label="Chiedi all'AI" variant="outlined" style={{backgroundColor: "gray"}} value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}/>
              <Button variant="contained" onClick={sendMessage}>SEND</Button>
          </Stack>
      </form>
    </Stack>
  );
}