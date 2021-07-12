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
} from '../Definitions/Constants/DrawerConfigs';
// Components
import Loading from '../Components/Molecules/Loading';
import NotFound from '../Components/Pages/NotFound';
// Components: dynamic imports
const FleetSettings = React.lazy(() => import('../Components/Pages/FleetSettings'));
const Pair = React.lazy(() => import('../Components/Pages/Pair'));
const PayAtTable = React.lazy(() => import('../Components/Pages/PayAtTable'));
const PreAuth = React.lazy(() => import('../Components/Pages/PreAuth'));
const Purchase = React.lazy(() => import('../Components/Pages/Purchase'));
const Refund = React.lazy(() => import('../Components/Pages/Refund'));
const Terminals = React.lazy(() => import('../Components/Pages/Terminals'));

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
