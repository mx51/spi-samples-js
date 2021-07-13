import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import menuItems from '../../../Definitions/Constants/MenuItemsConfigs';
// Icons
import { ReactComponent as SecondaryLogoIcon } from '../../../Images/SecondaryLogoIcon.svg';
// Interfaces
import { DrawerListInterface } from '../Interfaces/NavbarInterfaces';
// Components
import MenuItems from './MenuItems';
import NavbarHeader from '../NavbarHeader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: 256,
    },
    title: {
      color: '#9E9E9E',
      fontSize: 14,
      lineHeight: '21px',
      padding: theme.spacing(2),
      paddingBottom: 0,
    },
    menuLinks: {
      padding: theme.spacing(2),
    },
    divider: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
  })
);

const DrawerList: React.FC<DrawerListInterface> = ({ toggleDrawer }) => {
  const classes = useStyles();
  const { samplePos, terminals } = menuItems;

  return (
    <div className={classes.list} role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
      <NavbarHeader handleToggleDrawer={toggleDrawer} icon={<SecondaryLogoIcon />} />
      <div className={classes.menuLinks}>
        <Typography className={classes.title}>Sample POS</Typography>
        <MenuItems menuItems={samplePos} />
        <Divider className={classes.divider} />
        <Typography className={classes.title}>Terminals</Typography>
        <MenuItems menuItems={terminals} />
      </div>
    </div>
  );
};

export default DrawerList;
