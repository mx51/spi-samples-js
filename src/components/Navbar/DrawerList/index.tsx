import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import menuItems from '../../../definitions/constants/menuItemsConfigs';
// icons
import { ReactComponent as SecondaryLogoIcon } from '../../../images/SecondaryLogoIcon.svg';
// interfaces
import { IDrawerList } from '../interfaces/NavbarInterfaces';
// constants
import { TEXT_LIGHT_COLOR } from '../../../definitions/constants/themeStylesConfigs';
// components
import MenuItems from './MenuItems';
import NavbarHeader from '../NavbarHeader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: 256,
    },
    title: {
      color: TEXT_LIGHT_COLOR,
      fontSize: 14,
      paddingTop: theme.spacing(2),
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
    },
    menuLinks: {
      padding: theme.spacing(2),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  })
);

function DrawerList({ toggleDrawer }: IDrawerList): React.ReactElement {
  const classes = useStyles();
  const { samplePos, terminals } = menuItems;

  return (
    <div className={classes.list} role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
      <NavbarHeader handleToggleDrawer={toggleDrawer} icon={<SecondaryLogoIcon />} />
      <div className={classes.menuLinks}>
        <Typography className={classes.title}>Sample POS</Typography>
        <MenuItems menuItems={samplePos} />
        <Divider />
        <Typography className={classes.title}>Terminals</Typography>
        <MenuItems menuItems={terminals} />
      </div>
    </div>
  );
}

export default DrawerList;
