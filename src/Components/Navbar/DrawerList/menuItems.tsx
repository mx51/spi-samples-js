import React from 'react';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// Interfaces
import { MenuItemInterface, MenuItemsInterface } from '../Interfaces/DrawerInterfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      color: 'inherit',
      textDecoration: 'none',
    },
    listItem: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

const MenuItems: React.FC<MenuItemsInterface> = ({ menuItems }) => {
  const classes = useStyles();

  return (
    <List>
      {menuItems.map(({ name, path, icon }: MenuItemInterface) => (
        <Link to={path} key={`${name}`} className={classes.link}>
          <ListItem button className={classes.listItem}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
        </Link>
      ))}
    </List>
  );
};

export default MenuItems;
