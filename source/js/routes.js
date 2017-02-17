import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from 'views/App';
import Dashboard from 'views/Dashboard';
import Order from 'views/Order';
import Overview from 'views/Overview';
import Login from 'views/Login';
import Users from 'views/Users';
import Dishes from 'views/Dishes';
import Categories from 'views/Categories';
import Caterings from 'views/Caterings';
import Menus from 'views/Menus';
import NotFound from 'views/NotFound';

const publicPath = '/';

export const routeCodes = {
  ORDER: publicPath,
  DASHBOARD: `${ publicPath }dashboard`,
  LOGIN: `${ publicPath }login`,
  OVERVIEW: `${ publicPath }overview`,
  USERS: `${ publicPath }users`,
  DISHES: `${ publicPath }dishes`,
  CATEGORIES: `${ publicPath }categories`,
  CATERINGS: `${ publicPath }caterings`,
  MENUS: `${ publicPath }menus`,
};

export default class Routes extends Component {

  render() {
    return (
      <Router history={ browserHistory }>
        <Route path={ publicPath } component={ App }>
          <IndexRoute component={ Order } />
          <Route path={ routeCodes.DASHBOARD } component={ Dashboard } />
          <Route path={ routeCodes.OVERVIEW } component={ Overview } />
          <Route path={ routeCodes.LOGIN } component={ Login } />
          <Route path={ routeCodes.USERS } component={ Users } />
          <Route path={ routeCodes.DISHES } component={ Dishes } />
          <Route path={ routeCodes.CATEGORIES } component={ Categories } />
          <Route path={ routeCodes.CATERINGS } component={ Caterings } />
          <Route path={ routeCodes.MENUS } component={ Menus } />
          <Route path='*' component={ NotFound } />
        </Route>

      </Router>
    );
  }
}
