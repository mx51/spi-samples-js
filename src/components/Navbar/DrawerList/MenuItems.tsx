import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { NavLink, useLocation } from 'react-router-dom';
import { PRIMARY_THEME_COLOR, TEXT_LIGHT_COLOR } from '../../../definitions/constants/themeStylesConfigs';
import { IMenuItem, IMenuItems } from '../interfaces/DrawerInterfaces';

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
    primaryColor: {
      color: PRIMARY_THEME_COLOR,
    },
    textLightColor: {
      color: TEXT_LIGHT_COLOR,
    },
  })
);

const MenuItems: React.FC<IMenuItems> = ({ menuItems }) => {
  const classes = useStyles();
  const { pathname } = useLocation();

  return (
    <List>
      {menuItems.map(({ name, path, icon }: IMenuItem) => (
        <ListItem
          button
          key={`${name}`}
          className={classes.listItem}
          component={NavLink}
          to={path}
          selected={path === pathname}
        >
          <ListItemIcon className={path === pathname ? classes.primaryColor : classes.textLightColor}>
            {icon}
          </ListItemIcon>
          <ListItemText primary={name} className={path === pathname ? classes.primaryColor : classes.textLightColor} />
        </ListItem>
      ))}
    </List>
  );
};

export default React.memo(MenuItems);
