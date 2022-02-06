import React from 'react';
import { ReactComponent as IconCashout } from '../../images/CashoutIcon.svg';
import { ReactComponent as IconPairing } from '../../images/PairingIcon.svg';
import { ReactComponent as IconPurchase } from '../../images/PurchaseIcon.svg';
import { ReactComponent as IconRefund } from '../../images/RefundIcon.svg';
import { ReactComponent as IconTerminalsList } from '../../images/TerminalsListIcon.svg';
import {
  TEXT_CASHOUT,
  TEXT_PAIR,
  TEXT_PURCHASE,
  TEXT_REFUND,
  TEXT_TERMINALS,
  PATH_CASH_OUT,
  PATH_PAIR,
  PATH_PURCHASE,
  PATH_REFUND,
  PATH_TERMINALS,
} from './routerConfigs';

export default {
  samplePos: [
    {
      name: TEXT_PURCHASE,
      path: PATH_PURCHASE,
      icon: <IconPurchase />,
    },
    {
      name: TEXT_REFUND,
      path: PATH_REFUND,
      icon: <IconRefund />,
    },
    {
      name: TEXT_CASHOUT,
      path: PATH_CASH_OUT,
      icon: <IconCashout />,
    },
    // {
    //   name: TEXT_PRE_AUTH,
    //   path: PATH_PRE_AUTH,
    //   icon: <IconPreAuthorisation />,
    // },
    // {
    //   name: TEXT_PAY_AT_TABLE,
    //   path: PATH_PAY_AT_TABLE,
    //   icon: <IconPayAtTable />,
    // },
  ],
  terminals: [
    {
      name: TEXT_TERMINALS,
      path: PATH_TERMINALS,
      icon: <IconTerminalsList />,
    },
    {
      name: TEXT_PAIR,
      path: PATH_PAIR,
      icon: <IconPairing />,
    },
    // {
    //   name: TEXT_FLEET_SETTINGS,
    //   path: PATH_FLEET_SETTINGS,
    //   icon: <IconFleetSettings />,
    // },
  ],
};
