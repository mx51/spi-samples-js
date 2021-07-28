import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
// icons
import { ReactComponent as PrimaryLogoIcon } from '../../images/PrimaryLogoIcon.svg';
// interfaces
import { IDrawerPosition } from './interfaces/NavbarInterfaces';
// constants
import { PRIMARY_DARK_COLOR } from '../../definitions/constants/themeStylesConfigs';
// components
import DrawerList from './DrawerList';
import NavbarHeader from './NavbarHeader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    navbar: {
      background: PRIMARY_DARK_COLOR,
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
      <AppBar position="static" className={classes.navbar}>
        <NavbarHeader handleToggleDrawer={toggleDrawer(true)} icon={<PrimaryLogoIcon />} />
      </AppBar>
      <Drawer anchor="left" open={drawerToggle.left} onClose={toggleDrawer(false)}>
        <DrawerList toggleDrawer={toggleDrawer(false)} />
      </Drawer>
    </div>
  );
};

export default Navbar;
