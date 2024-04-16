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
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import styles from './chat.module.css'
import Image from 'next/image';
import robot from './media/sendButton.png';
import robot_medico from './media/robot_medico.png';




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
    
    <Stack className={styles.total}>
      <Stack className={styles.gruppoMess}>
        <Card className={styles.card_header}>
          <Box className={styles.box} >
            <CardContent className={styles.cardContent}>
              <Typography component="div" variant="h5" className={styles.typography}>
                Benvenuto!
              </Typography>
            </CardContent>
          </Box>
            <Image className={styles.header_immagine}
              src={robot_medico}
              alt="robot-medico"
              width={70}
              height={70}
            />
          
        </Card>

        {history.map((singleMessage) => (
          <ChatLine 
            /* ci vorrebbe il prop key che identifica univocamente gli elementi della lista */
            key={i++}
            message={singleMessage}
          />))}
      </Stack>
      <form className={styles.input}>
        <Stack spacing={2} direction="row" className={styles.inputLine}>
          <TextField id="outlined-basic" label="Chiedi all'AI" variant="outlined" className={styles.textField} value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
          <Button variant="contained" onClick={sendMessage} className={styles.button}>
            <Image
              src={robot}
              alt="invia"
              width={45}
              height={45}
            />
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}