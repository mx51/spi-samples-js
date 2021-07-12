import React, { KeyboardEvent, MouseEvent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
// Interfaces
import { DrawerPositionInterface } from '../../../Definitions/Interfaces/NavbarInterface';
// Icons Components
import PrimaryLogoIcon from '../../Atoms/Icons/PrimaryLogoIcon';
import DrawerList from '../../Organisms/DrawerList';
import NavbarHeader from '../../Molecules/NavbarHeader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  })
);

const Navbar: React.FC = () => {
  const classes = useStyles();

  const [drawerToggle, setDrawerToggle] = React.useState<DrawerPositionInterface>({
    left: false,
  });

  const toggleDrawer = (isOpen: boolean) => (event: KeyboardEvent | MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerToggle({ left: isOpen });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <NavbarHeader handleToggleDrawer={toggleDrawer(true)} icon={<PrimaryLogoIcon />} />
      </AppBar>
      <Drawer anchor="left" open={drawerToggle.left} onClose={toggleDrawer(false)}>
        <DrawerList toggleDrawer={() => toggleDrawer(false)} />
      </Drawer>
    </div>
  );
};

export default Navbar;
