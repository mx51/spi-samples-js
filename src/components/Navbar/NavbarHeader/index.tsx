import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
// interfaces
import { INavbarHeader } from '../interfaces/NavbarInterfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
  })
);

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
      >
        <MenuIcon />
      </IconButton>
      {icon}
    </Toolbar>
  );
}

export default NavbarHeader;
