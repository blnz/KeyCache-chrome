import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import CardsList from '../components/CardsList';
import MainSection from '../components/MainSection';
import Registration from '../components/Registration';

import * as TodoActions from '../actions/todos';

import {deepOrange500} from 'material-ui/styles/colors';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';


const styles = {
  container: {
    // textAlign: 'center',
    // paddingTop: 200,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});


@connect(
  state => ({
    todos: state.todos,
    cards: state.cards,
    user: state.user
  }),
  dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
  })
)

export default class App extends Component {

  static propTypes = {
    todos: PropTypes.array.isRequired,
    cards: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  handleRegister = userData => {
    console.log("app register:", userData);
    this.props.actions.registerUser(userData);
  }

  handleWipe = event => {
    this.props.actions.deleteAll()

  }
  render() {

    var mainMenu =
      (
	  <IconMenu
	iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
	}
	targetOrigin={{horizontal: 'right', vertical: 'top'}}
	anchorOrigin={{horizontal: 'right', vertical: 'top'}}
	  >
          <MenuItem primaryText="Erase All Data" onTouchTap={ this.handleWipe }/>

          <MenuItem primaryText="logout" onTouchTap={(e) => { console.log("forgetting password")} }/>
	  </IconMenu>
      );

    console.log("props:", this.props)
    const { todos, user, cards, actions } = this.props;

    if (user.clearkey) {

      return (
          <div>
	  <MuiThemeProvider muiTheme={muiTheme} >
          <div style={styles.container}>
          <AppBar
        title="KeyCache"
        iconElementLeft={ <span /> }
        iconElementRight={ mainMenu } />
          <CardsList cards={cards}  actions={actions} addTodo={actions.addTodo} />

        { /*<MainSection todos={todos} actions={actions} addTodo={actions.addTodo} /> */ }
        </div>
          </MuiThemeProvider>
	  </div>
      );
    } else if (user.masterkey) {
      return (
          <div> need you to sign in </div>
      );
    } else {
      return (
          <div>
	  <MuiThemeProvider muiTheme={muiTheme} >
          <div style={styles.container}>
          <AppBar
        title="KeyCache"
        iconElementLeft={ <span /> }
        iconElementRight={ mainMenu } />

          <div>Register, please</div>
          <Registration onSave={this.handleRegister} onTestThunk={this.props.actions.makeSandwichesForEverybody}/>
          </div>
          </MuiThemeProvider>
          </div>
      );
    }
  }
}
