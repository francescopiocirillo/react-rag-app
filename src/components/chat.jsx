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
/*import Scrollbar from "react-scrollbars-custom"*/
import Paper  from '@mui/material/Paper';
import List from '@mui/material/List';
import SnackbarContent from '@mui/material/SnackbarContent';
import { teal, cyan } from '@mui/material/colors';
import Grow from '@mui/material/Grow';


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

  const fadeAwayRef = useRef(null);
  function fadeAway() {
    console.log("pippo");
    fadeAwayRef.current.style.display = "none";
  }

  const actionSnack = (
    <Button size="small" onClick={fadeAway}>
      okay
    </Button>
  );
  

  let i = 0;
  return (
   
    <List className={styles.total}>
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
      <Paper className={styles.paper}>
        <List className={styles.gruppoMess}>

          {history.map((singleMessage) => (
            
            <ChatLine 
              /* ci vorrebbe il prop key che identifica univocamente gli elementi della lista */
              key={i++}
              message={singleMessage}
            />
          ))}
          
        </List>
    
        <Stack
        ref = {fadeAwayRef}
        mx={30}
        p={5}
        spacing={2} sx={{ maxWidth: 600 }} classMessage={styles.popUpIni} >
            <SnackbarContent sx={{ bgcolor: teal[900] }}  message="Questo assistente è ideato per aiutare il medico a seguire 
              i propri prazienti. Si prega di scrivere il proprio quesito nella barra sottostande
              e premere il bottone a destra. Successivamente attendere che l'assistente risponda." action={actionSnack} />
        </Stack>
      </Paper>
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
    </List>
    
  );
}