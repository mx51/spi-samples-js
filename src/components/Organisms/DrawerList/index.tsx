import React, { KeyboardEvent, MouseEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PairingIcon from '../../atoms/Icons/PairingIcon';
import SecondaryLogoIcon from '../../atoms/Icons/SecondaryLogoIcon';
import NavbarHeader from '../../Molecules/NavbarHeader';
import PurchaseIcon from '../../atoms/Icons/PurchaseIcon';
import RefundIcon from '../../atoms/Icons/RefundIcon';
import PreauthorisationIcon from '../../atoms/Icons/PreauthorisationIcon';
import TerminalsListIcon from '../../atoms/Icons/TerminalsListIcon';
import FleetSettingsIcon from '../../atoms/Icons/FleetSettingsIcon';

const useStyles = makeStyles({
  list: {
    width: 256,
  },
});

interface DrawerListInterface {
  toggleDrawer: (event: KeyboardEvent | MouseEvent) => void;
}

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
