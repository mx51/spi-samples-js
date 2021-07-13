import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// Icons
import PairingIcon from '../../Icons/PairingIcon';
import SecondaryLogoIcon from '../../Icons/SecondaryLogoIcon';
// Interfaces
import { DrawerListInterface } from '../Interfaces/NavbarInterface';
// Components
import NavbarHeader from '../NavbarHeader';
import PurchaseIcon from '../../Icons/PurchaseIcon';
import RefundIcon from '../../Icons/RefundIcon';
import PreauthorisationIcon from '../../Icons/PreauthorisationIcon';
import TerminalsListIcon from '../../Icons/TerminalsListIcon';
import FleetSettingsIcon from '../../Icons/FleetSettingsIcon';

const useStyles = makeStyles({
  list: {
    width: 256,
  },
});

const DrawerList: React.FC<DrawerListInterface> = ({ toggleDrawer }) => {
  const classes = useStyles();

  return (
    <div className={classes.list} role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
      <NavbarHeader handleToggleDrawer={toggleDrawer} icon={<SecondaryLogoIcon />} />
      <List>
        <ListItem button>
          <ListItemIcon>
            <PurchaseIcon active />
          </ListItemIcon>
          <ListItemText primary="Purchase" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <RefundIcon active />
          </ListItemIcon>
          <ListItemText primary="Refund" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <PreauthorisationIcon active={false} />
          </ListItemIcon>
          <ListItemText primary="Preauthorisation" />
        </ListItem>
        {/* List of Items (Molecules) */}
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <TerminalsListIcon active />
          </ListItemIcon>
          <ListItemText primary="Terminals list" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <PairingIcon active />
          </ListItemIcon>
          <ListItemText primary="Pairing" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <FleetSettingsIcon active={false} />
          </ListItemIcon>
          <ListItemText primary="Fleet settings" />
        </ListItem>
      </List>
    </div>
  );
};

export default DrawerList;
