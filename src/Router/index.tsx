import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// Constants
import {
  PATH_FLEET_SETTINGS,
  PATH_PAIR,
  PATH_PAY_AT_TABLE,
  PATH_PRE_AUTH,
  PATH_PURCHASE,
  PATH_REFUND,
  PATH_TERMINALS,
} from '../Definitions/Constants/RouterConfigs';
// Components
import Loading from '../Components/Loading';
// Components: dynamic imports
const FleetSettings = React.lazy(() => import('../Components/FleetSettingsPage'));
const Pair = React.lazy(() => import('../Components/PairPage'));
const PayAtTable = React.lazy(() => import('../Components/PayAtTablePage'));
const PreAuth = React.lazy(() => import('../Components/PreAuthPage'));
const Purchase = React.lazy(() => import('../Components/PurchasePage'));
const Refund = React.lazy(() => import('../Components/RefundPage'));
const Terminals = React.lazy(() => import('../Components/TerminalsPage'));
const NotFound = React.lazy(() => import('../Components/NotFoundPage'));

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
