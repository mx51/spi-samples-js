import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Loading from '../components/Loading';
import {
  PATH_PAIR,
  PATH_PAY_NOW,
  PATH_PRE_AUTH,
  PATH_PURCHASE,
  PATH_REFUND,
  PATH_TERMINALS,
  PATH_ORDER_FINISHED,
  PATH_CASH_OUT,
  PATH_SUPPORT,
} from '../definitions/constants/routerConfigs';

const Pair = React.lazy(() => import('../components/PairPage'));
const PreAuth = React.lazy(() => import('../components/PreAuthPage'));
const Purchase = React.lazy(() => import('../components/PurchasePage'));
const Refund = React.lazy(() => import('../components/RefundPage'));
const Terminals = React.lazy(() => import('../components/TerminalsPage'));
const TerminalsDetails = React.lazy(() => import('../components/TerminalsPage/TerminalDetails'));
const OrderFinished = React.lazy(() => import('../components/OrderFinished'));
const NotFound = React.lazy(() => import('../components/NotFoundPage'));
const PayNow = React.lazy(() => import('../components/PayNow'));
const Cashout = React.lazy(() => import('../components/CashoutPage'));
const SupportTool = React.lazy(() => import('../components/SupportToolsPage'));

const AppRoutes = (): React.ReactElement => (
  <Router>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path={PATH_PAIR} component={Pair} />
        <Route exact path={PATH_PRE_AUTH} component={PreAuth} />
        <Route exact path={PATH_PURCHASE} component={Purchase} />
        <Route exact path={PATH_REFUND} component={Refund} />
        <Route exact path={PATH_TERMINALS} component={Terminals} />
        <Route exact path={`${PATH_TERMINALS}/:id`} component={TerminalsDetails} />
        <Route exact path={PATH_PAY_NOW} component={PayNow} />
        <Route exact path={PATH_CASH_OUT} component={Cashout} />
        <Route exact path={PATH_ORDER_FINISHED} component={OrderFinished} />
        <Route exact path={PATH_SUPPORT} component={SupportTool} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  </Router>
);

export default AppRoutes;
