import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; /*npm install @mui/icons-material */
import styles from './addFile.module.css';
import Tooltip from '@mui/material/Tooltip';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function InputFileUpload() {
  return (
    <Tooltip title="Add file" placement="top">
    <Button className={styles.button}
      component="label"
      variant="contained"
    >
      <CloudUploadIcon />
      <VisuallyHiddenInput type="file" />
    </Button>
    </Tooltip>
  );
}
