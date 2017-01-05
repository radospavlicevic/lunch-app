import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from 'views/App';
import Dashboard from 'views/Dashboard';
import Order from 'views/Order';
import About from 'views/About';
import Login from 'views/Login';
import NotFound from 'views/NotFound';

const publicPath = '/';

export const routeCodes = {
  DASHBOARD: publicPath,
  ORDER: `${ publicPath }order`,
  ABOUT: `${ publicPath }about`,
  LOGIN: `${ publicPath }login`,
};

export default class Routes extends Component {
  render() {
    return (
      <Router history={ browserHistory }>
        <Route path={ publicPath } component={ App }>
          <IndexRoute component={ Dashboard } />
          <Route path={ routeCodes.DASHBOARD } component={ Dashboard } />
          <Route path={ routeCodes.ORDER } component={ Order } />
          <Route path={ routeCodes.ABOUT } component={ About } />
          <Route path={ routeCodes.LOGIN } component={ Login } />

          <Route path='*' component={ NotFound } />
        </Route>
      </Router>
    );
  }
}
