'use client';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { blue } from '@mui/material/colors';
import styles from './chat-line.module.css';
import Avatar from '@mui/material/Avatar';
import MedicalInformationTwoToneIcon from '@mui/icons-material/MedicalInformationTwoTone';
import { cyan } from '@mui/material/colors';
import TipsAndUpdatesTwoToneIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';

export default function ChatLine({message}) {
  return (
    <Card className={styles.total}>
      <CardActionArea className={message instanceof HumanMessage ? styles.contDoctor : styles.contAi}>
      {message instanceof HumanMessage ? "" : <Avatar className={styles.AvatarAI} sx={{ bgcolor: cyan.A700 }}><TipsAndUpdatesTwoToneIcon/></Avatar>}
      
        <CardContent className={message instanceof HumanMessage ? styles.doctor : styles.ai}>
          <h3>{message instanceof HumanMessage ? ("Doctor") : ("AI")}</h3>
          <p>
            {message.content}
          </p>
        </CardContent>
        {message instanceof HumanMessage ? <Avatar className={styles.AvatarDoc} sx={{ bgcolor: cyan[100] }} ><MedicalInformationTwoToneIcon/></Avatar> : "" }
      
      </CardActionArea>
    </Card>
  );
}
