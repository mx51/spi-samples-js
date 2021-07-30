import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Loading from '../components/Loading';
import {
  PATH_FLEET_SETTINGS,
  PATH_PAIR,
  PATH_PAY_AT_TABLE,
  PATH_PRE_AUTH,
  PATH_PURCHASE,
  PATH_REFUND,
  PATH_TERMINALS,
} from '../definitions/constants/routerConfigs';

const FleetSettings = React.lazy(() => import('../components/FleetSettingsPage'));
const Pair = React.lazy(() => import('../components/PairPage'));
const PayAtTable = React.lazy(() => import('../components/PayAtTablePage'));
const PreAuth = React.lazy(() => import('../components/PreAuthPage'));
const Purchase = React.lazy(() => import('../components/PurchasePage'));
const Refund = React.lazy(() => import('../components/RefundPage'));
const Terminals = React.lazy(() => import('../components/TerminalsPage'));
const NotFound = React.lazy(() => import('../components/NotFoundPage'));

const AppRoutes: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Router>
      <Switch>
        <Route exact path={PATH_FLEET_SETTINGS} component={FleetSettings} />
        <Route exact path={PATH_PAIR} component={Pair} />
        <Route exact path={PATH_PAY_AT_TABLE} component={PayAtTable} />
        <Route exact path={PATH_PRE_AUTH} component={PreAuth} />
        <Route exact path={PATH_PURCHASE} component={Purchase} />
        <Route exact path={PATH_REFUND} component={Refund} />
        <Route exact path={PATH_TERMINALS} component={Terminals} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </Suspense>
);

export default AppRoutes;
