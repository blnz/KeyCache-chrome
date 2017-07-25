import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';

import App from './App';
import Settings from '../components/Settings';
import Card from '../components/Card';

export default class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  noRouteRender() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route path="/" component={App}>
            <Route path="/settings" component={Settings} />
            <Route path="/card/:cardId" component={Card} />
          </Route>
        </Router>
      </Provider>
    );
  }
}
