import React from 'react';
import { ReactComponent as IconCashout } from '../../images/CashoutIcon.svg';
import { ReactComponent as IconPairing } from '../../images/PairingIcon.svg';
import { ReactComponent as IconPreAuth } from '../../images/PreAuthorisationIcon.svg';
import { ReactComponent as IconPurchase } from '../../images/PurchaseIcon.svg';
import { ReactComponent as IconRefund } from '../../images/RefundIcon.svg';
import { ReactComponent as IconSupport } from '../../images/SupportIcon.svg';
import { ReactComponent as IconTerminalsList } from '../../images/TerminalsListIcon.svg';
import {
  TEXT_CASHOUT,
  TEXT_PAIR,
  TEXT_PRE_AUTH,
  TEXT_PURCHASE,
  TEXT_REFUND,
  TEXT_TERMINALS,
  TEXT_SUPPORT,
  PATH_CASH_OUT,
  PATH_PAIR,
  PATH_PRE_AUTH,
  PATH_PURCHASE,
  PATH_REFUND,
  PATH_TERMINALS,
  PATH_SUPPORT,
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
    //   icon: <IconPreAuth />,
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
  ],
  support: [
    {
      name: TEXT_SUPPORT,
      path: PATH_SUPPORT,
      icon: <IconSupport />,
    },
  ],
};
