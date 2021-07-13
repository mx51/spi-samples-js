import React from 'react';
import { ReactComponent as Logo } from '../../../Images/FleetSettingsIcon.svg';
import { ReactComponent as IconPairing } from '../../../Images/PairingIcon.svg';
import { ReactComponent as IconPayAtTable } from '../../../Images/PayAtTableIcon.svg';
import { ReactComponent as IconPreauthorisation } from '../../../Images/PreauthorisationIcon.svg';
import { ReactComponent as IconPurchase } from '../../../Images/PurchaseIcon.svg';
import { ReactComponent as IconRefund } from '../../../Images/RefundIcon.svg';
import { ReactComponent as IconTerminalsList } from '../../../Images/TerminalsListIcon.svg';

export interface MenuItemInterface {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export interface MenuItemsInterface {
  menuItems: MenuItemInterface[];
}

export default {
  samplePos: [
    {
      name: 'Purchase',
      path: '/',
      icon: <IconPurchase />,
    },
    {
      name: 'Refund',
      path: '/',
      icon: <IconRefund />,
    },
    {
      name: 'Pay at Table',
      path: '/',
      icon: <IconPayAtTable />,
    },
    {
      name: 'Preauthorisation',
      path: '/',
      icon: <IconPreauthorisation />,
    },
  ],
  terminals: [
    {
      name: 'Terminal lists',
      path: '/',
      icon: <IconTerminalsList />,
    },
    {
      name: 'Pairing',
      path: '/',
      icon: <IconPairing />,
    },
    {
      name: 'Fleet settings',
      path: '/',
      icon: <Logo />,
    },
  ],
};
