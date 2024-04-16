'use client';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { blue } from '@mui/material/colors';
import styles from './chat-line.module.css'


export default function ChatLine({message}) {
  return (
    <Card>
      <CardActionArea>
        <CardContent className={message instanceof HumanMessage ? styles.doc : styles.ai}>
          <h3>{message instanceof HumanMessage ? ("Doctor") : ("AI")}</h3>
          <p>
            {message.content}
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
