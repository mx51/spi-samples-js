import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import menuItems, { MenuItemInterface } from './menuItems';
// Icons
import SecondaryLogoIcon from '../../Icons/SecondaryLogoIcon';
// Interfaces
import { DrawerListInterface } from '../Interfaces/NavbarInterface';
// Components
import NavbarHeader from '../NavbarHeader';

const useStyles = makeStyles({
  list: {
    width: 256,
  },
});

const DrawerList: React.FC<DrawerListInterface> = ({ toggleDrawer }) => {
  const classes = useStyles();
  const { samplePos, terminals } = menuItems;

  return (
    <div className={classes.list} role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
      <NavbarHeader handleToggleDrawer={toggleDrawer} icon={<SecondaryLogoIcon />} />

      <List>
        {samplePos.map((item: MenuItemInterface) => (
          <ListItem button>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {terminals.map((item: MenuItemInterface) => (
          <ListItem button>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default DrawerList;
