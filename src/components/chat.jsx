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
import TransitionAlerts from './pupUp';
import InputFileUpload from './addFile';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AnchorTemporaryDrawer from './showFile';

export default function Chat() {

  const [history, setHistory] = useState(chatHistory);
  const [inputMessage, setInputMessage] = useState("");
  const containerRef = useRef(null);
  const fadeAwayRef = useRef(null);
  const [loading, setLoading] = useState(false);

  function fadeAway() {
    fadeAwayRef.current.style.display = "none";
  }  
  
  function handleClick() {
    sendMessage();
  }

  //Should this be eliminated?
  const actionSnack = (
    <Button size="small" onClick={fadeAway}>
      okay
    </Button>
  );

  useEffect(() => {
    // This effect will run whenever history changes
    //console.log("effetto");
    scrollToBottom(containerRef);
  }, [JSON.stringify(history)]); //or `${outcomes}`, just putting history doesn't work because the array remains the same
  
  const sendMessage = () => {
    setLoading(true);
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
      })
      .finally(() => setLoading(false));
  }

  let i = 0;
  return (
    <List className={styles.total} >
      <Card className={styles.card_header}>
        <Box className={styles.box} >
          <CardContent className={styles.cardContent}>
            <Typography component="div" variant="h5" className={styles.typography}>
              Benvenuto in MedChatbot!
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
      <Paper ref={containerRef} className={styles.paper}>
        <List className={styles.gruppoMess}>
          {history.map((singleMessage) => (
            <ChatLine 
              key={i++}
              message={singleMessage}
            />
          ))}
        </List>
        <TransitionAlerts/>
      </Paper>
      <form className={styles.input}>
        <Stack spacing={2} direction="row" className={styles.inputLine}>
          <InputFileUpload/>
          <AnchorTemporaryDrawer/>
          <TextField id="outlined-basic" label="Chiedi all'AI" variant="outlined" className={styles.textField} value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
          <Box>
            <LoadingButton className={styles.button}
              onClick={handleClick}
              endIcon={<Image
                  src={robot}
                  alt="invia"
                  width={40}
                  height={40}
                />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
            >
            send
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </List>
  );
}