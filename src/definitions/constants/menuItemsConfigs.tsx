import React from 'react';
// paths & links constants
import {
  LINK_FLEET_SETTINGS,
  LINK_PAIR,
  LINK_PAY_AT_TABLE,
  LINK_PRE_AUTH,
  LINK_PURCHASE,
  LINK_REFUND,
  LINK_TERMINALS,
  PATH_FLEET_SETTINGS,
  PATH_PAIR,
  PATH_PAY_AT_TABLE,
  PATH_PRE_AUTH,
  PATH_PURCHASE,
  PATH_REFUND,
  PATH_TERMINALS,
} from './routerConfigs';
// icons
import { ReactComponent as IconFleetSettings } from '../../images/FleetSettingsIcon.svg';
import { ReactComponent as IconPairing } from '../../images/PairingIcon.svg';
import { ReactComponent as IconPayAtTable } from '../../images/PayAtTableIcon.svg';
import { ReactComponent as IconPreAuthorisation } from '../../images/PreAuthorisationIcon.svg';
import { ReactComponent as IconPurchase } from '../../images/PurchaseIcon.svg';
import { ReactComponent as IconRefund } from '../../images/RefundIcon.svg';
import { ReactComponent as IconTerminalsList } from '../../images/TerminalsListIcon.svg';

export default {
  samplePos: [
    {
      name: LINK_PURCHASE,
      path: PATH_PURCHASE,
      icon: <IconPurchase />,
    },
    {
      name: LINK_REFUND,
      path: PATH_REFUND,
      icon: <IconRefund />,
    },
    {
      name: LINK_PAY_AT_TABLE,
      path: PATH_PAY_AT_TABLE,
      icon: <IconPayAtTable />,
    },
    {
      name: LINK_PRE_AUTH,
      path: PATH_PRE_AUTH,
      icon: <IconPreAuthorisation />,
    },
  ],
  terminals: [
    {
      name: LINK_TERMINALS,
      path: PATH_TERMINALS,
      icon: <IconTerminalsList />,
    },
    {
      name: LINK_PAIR,
      path: PATH_PAIR,
      icon: <IconPairing />,
    },
    {
      name: LINK_FLEET_SETTINGS,
      path: PATH_FLEET_SETTINGS,
      icon: <IconFleetSettings />,
    },
  ],
};
