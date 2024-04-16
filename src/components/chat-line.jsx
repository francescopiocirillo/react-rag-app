'use client';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export default function ChatLine({message}) {
  return (
    <Card style={{minHeight: 75}}>
      <CardActionArea>
        <CardContent>
          <h3>{message instanceof HumanMessage ? ("Doctor") : ("AI")}</h3>
          <p>
            {message.content}
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
