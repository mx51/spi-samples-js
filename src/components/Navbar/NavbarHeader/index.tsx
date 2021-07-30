import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import { INavbarHeader } from '../interfaces/NavbarInterfaces';
import useStyles from './index.styles';

function NavbarHeader({ handleToggleDrawer, icon }: INavbarHeader): React.ReactElement {
  const classes = useStyles();

  return (
    <Toolbar variant="dense">
      <IconButton
        data-testid="navbarMenuIcon"
        className={classes.menuButton}
        color="inherit"
        edge="start"
        onClick={handleToggleDrawer}
        name="menuIcon"
        aria-label="menu"
      >
        <MenuIcon />
      </IconButton>
      {icon}
    </Toolbar>
  );
}

export default NavbarHeader;
