import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { PRIMARY_DARK_COLOR } from '../../definitions/constants/themeStylesConfigs';
import { ReactComponent as PrimaryLogoIcon } from '../../images/PrimaryLogoIcon.svg';
import DrawerList from './DrawerList';
import { IDrawerPosition } from './interfaces/NavbarInterfaces';
import NavbarHeader from './NavbarHeader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    navbar: {
      background: PRIMARY_DARK_COLOR,
      position: 'fixed',
      top: 0,
      zIndex: 1201, // ensure developer mode toggle is on the top layer
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  })
);

const Navbar: React.FC = () => {
  const classes = useStyles();

  const [drawerToggle, setDrawerToggle] = React.useState<IDrawerPosition>({
    left: false,
  });

  const toggleDrawer = (isOpen: boolean) => () => {
    setDrawerToggle({ left: isOpen });
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.navbar}>
        <NavbarHeader handleToggleDrawer={toggleDrawer(true)} icon={<PrimaryLogoIcon />} isDevelopModeShown />
      </AppBar>
      <Drawer anchor="left" open={drawerToggle.left} onClose={toggleDrawer(false)}>
        <DrawerList toggleDrawer={toggleDrawer(false)} />
      </Drawer>
    </div>
  );
};

export default Navbar;
