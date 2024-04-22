import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { teal, cyan } from '@mui/material/colors';
import styles from './popUp.module.css'

export default function TransitionAlerts() {
  const [open, setOpen] = React.useState(true);

  return (
    <Box className={styles.total} >
      <Collapse in={open}>
        <Alert severity="info"
          action={
            <IconButton
              aria-label="close"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Questo assistente è ideato per aiutare il medico a seguire 
              i propri prazienti. Si prega di scrivere il proprio quesito nella barra sottostante
              e premere il bottone a destra. Successivamente attendere che l'assistente risponda.
        </Alert>
      </Collapse>
    </Box>
  );
}