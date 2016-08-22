import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import CardsList from '../components/CardsList';
import Registration from '../components/Registration';
import Authentication from '../components/Authentication';

import * as CardActions from '../actions/cards';

import {deepOrange500} from 'material-ui/styles/colors';
import {
  cyan500, cyan700,
  pinkA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
} from  'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
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
    primary1Color: '#009e9e', // cyan500,
    primary2Color: '#19f6f6', // cyan700,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
  waspalette: {
    accent1Color: deepOrange500,
    
  },
});


@connect(
  state => ({
    cards: state.cards,
    temps: state.temps,
    user: state.user
  }),
  dispatch => ({
    actions: bindActionCreators(CardActions, dispatch)
  })
)

export default class App extends Component {

  static propTypes = {
    cards: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  handleRegister = userData => {
    this.props.actions.registerUser(userData);
  }

  handleLogin = userData => {
    this.props.actions.authenticateUser(userData);
  }

  handleLogout = () => {
    this.props.actions.logoutUser();
  }

  handleWipe = event => {
    this.props.actions.deleteAll()
  }

  render() {

    const { user, cards, temps, actions } = this.props;

    var mainMenu =
      (
	  <IconMenu iconButtonElement={
              <IconButton><MoreVertIcon /></IconButton>
	  }
	targetOrigin={{horizontal: 'right', vertical: 'top'}}
	anchorOrigin={{horizontal: 'right', vertical: 'top'}}
	  >
          <MenuItem primaryText="Logout" onTouchTap={ this.handleLogout }/>
          <MenuItem primaryText="Erase All Data" onTouchTap={ this.handleWipe }/>
	  </IconMenu>
      );

    if (temps.masterKey) {

      return (
          <div>
	  <MuiThemeProvider muiTheme={muiTheme} >
          <div style={styles.container}>
          <AppBar
        title="KeyCache"
        iconElementLeft={ <span /> }
        iconElementRight={ mainMenu } />
          <CardsList cards={cards}  actions={actions} />
          </div>
          </MuiThemeProvider>
	  </div>
      );
    } else if (user.wrappedKey) {
      // the user has registered previously, but we need to unwrap the masterKey
      return (
          <div>
	  <MuiThemeProvider muiTheme={muiTheme} >
          <div style={styles.container}>
          <AppBar
        title="KeyCache"
        iconElementLeft={ <span /> }
        iconElementRight={ mainMenu } />
          <div style={ { margin: "40px" } }>
          <div>Please authenticate</div>
          <Authentication onSave={this.handleLogin} user={user}/>
          </div>
          </div>
          </MuiThemeProvider>
          </div>

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
          <Registration onSave={this.handleRegister} />
          </div>
          </MuiThemeProvider>
          </div>
      );
    }
  }
}
