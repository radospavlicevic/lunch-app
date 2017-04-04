import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from 'views/App';
import Home from 'views/Home';
import Profile from 'views/Profile';
import Login from 'views/Login';
import Users from 'views/Users';
import Dishes from 'views/Dishes';
import Categories from 'views/Categories';
import Caterings from 'views/Caterings';
import Menus from 'views/Menus';
import WeeklyOverview from 'views/WeeklyOverview';
import Report from 'views/Report';
import NotFound from 'views/NotFound';

const publicPath = '/';

export const routeCodes = {
  HOME: publicPath,
  PROFILE: `${ publicPath }profile`,
  ORDER: `${ publicPath }order(/:date)(/:state)`,
  LOGIN: `${ publicPath }login`,
  USERS: `${ publicPath }users`,
  DISHES: `${ publicPath }dishes`,
  CATEGORIES: `${ publicPath }categories`,
  CATERINGS: `${ publicPath }caterings`,
  MENUS: `${ publicPath }menus`,
  WEEKLY_OVERVIEW: `${ publicPath }weekly-overview`,
  REPORT: `${ publicPath }report`,
};

export default class Routes extends Component {

  render() {
    return (
      <Router history={ browserHistory }>
        <Route path={ publicPath } component={ App }>
          <IndexRoute component={ Home } />
          <Route path={ routeCodes.ORDER } component={ Home } />
          <Route path={ routeCodes.PROFILE } component={ Profile } />
          <Route path={ routeCodes.LOGIN } component={ Login } />
          <Route path={ routeCodes.USERS } component={ Users } />
          <Route path={ routeCodes.DISHES } component={ Dishes } />
          <Route path={ routeCodes.CATEGORIES } component={ Categories } />
          <Route path={ routeCodes.CATERINGS } component={ Caterings } />
          <Route path={ routeCodes.MENUS } component={ Menus } />
          <Route path={ routeCodes.WEEKLY_OVERVIEW } component={ WeeklyOverview } />
          <Route path={ routeCodes.REPORT } component={ Report } />
          <Route path='*' component={ NotFound } />
        </Route>
      </Router>
    );
  }
}
