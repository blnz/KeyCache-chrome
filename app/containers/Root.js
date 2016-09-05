import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';

import App from './App';
import Settings from '../components/Settings';

export default class Root extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { store } = this.props;
    return (
        <Provider store={store}>
        <Router history={hashHistory}>
        <Route path="/" component={App}>
        <Route path="/settings" component={Settings} />
        </Route>
        </Router>
        </Provider>
    );
  }
  noRouteRender() {
    const { store } = this.props;
    return (
        <Provider store={store}>
        <App />
        </Provider>
    );
  }
}
