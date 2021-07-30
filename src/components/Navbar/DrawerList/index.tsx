import React from 'react';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import menuItems from '../../../definitions/constants/menuItemsConfigs';
import { ReactComponent as SecondaryLogoIcon } from '../../../images/SecondaryLogoIcon.svg';
import { IDrawerList } from '../interfaces/NavbarInterfaces';
import NavbarHeader from '../NavbarHeader';
import useStyles from './index.styles';
import MenuItems from './MenuItems';

function DrawerList({ toggleDrawer }: IDrawerList): React.ReactElement {
  const classes = useStyles();
  const { samplePos, terminals } = menuItems;

  return (
    <Box className={classes.list} onClick={toggleDrawer} onKeyDown={toggleDrawer}>
      <NavbarHeader handleToggleDrawer={toggleDrawer} icon={<SecondaryLogoIcon />} />
      <div className={classes.menuLinks}>
        <Typography className={classes.title}>Sample POS</Typography>
        <MenuItems menuItems={samplePos} />
        <Divider />
        <Typography className={classes.title}>Terminals</Typography>
        <MenuItems menuItems={terminals} />
      </div>
    </Box>
  );
}

export default DrawerList;
