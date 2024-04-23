import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import styles from './showFile.module.css';
import FilePresentTwoToneIcon from '@mui/icons-material/FilePresentTwoTone';
import Tooltip from '@mui/material/Tooltip';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import { cyan } from '@mui/material/colors';

export default function AnchorTemporaryDrawer() {
  const [state, setState] = React.useState({
    right: false,
  });

  const   toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List className={styles.elenco}>
        <h1> <PictureAsPdfOutlinedIcon/> File</h1>
        {['lollo.pdf', 'ciccio.pdf', 'paperino.pdf'].map((text, index) => (
          <ListItem key={text} disablePadding className={styles.itemElenco}>
            <ListItemButton>
              <ListItemIcon>
                <ArticleOutlinedIcon style={{ color:cyan[400] }}/>
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider /> {/* linea grigia per dividere i paragrafi */}
      <List className={styles.elenco}>
        <h1> <LinkOutlinedIcon/> Links</h1>
        {['https://learnenglish.britishcouncil.org/test-your-english?destination=/online-english-level-test#/?_k=x7vynw', 'www.mui.com', 'http://www.google.com/drive/docs'].map((text, index) => (
          <ListItem key={text} disablePadding className={styles.itemElenco}>
            <ListItemButton>
              <ListItemIcon>
                <LanguageOutlinedIcon style={{ color:cyan[400] }}/>
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div >
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Tooltip title="Show file" placement="top">
            <Button onClick={toggleDrawer(anchor, true)} 
              variant="contained" 
              className={styles.button}>
                <FilePresentTwoToneIcon/>
            </Button>
          </Tooltip>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}