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

/*  useEffect(() => {
    // This effect will run whenever chatHistory changes
    console.log("CIAOOO");
    setHistory(chatHistory);
  }, [history]);*/
  
  const [inputMessage, setInputMessage] = useState("");
  const sendMessage = () => {
    chatHistory.push(new HumanMessage(inputMessage));
    setHistory(chatHistory);
    setInputMessage("");
  }

  let i = 0;
  return (
    <Stack>
      <Stack style={{maxHeight: 450, overflow: "auto", backgroundColor:'darkgrey'}}>
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