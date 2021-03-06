import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';

import Header from '../components/Header';

import CardsList from '../components/CardsList';
import Registration from '../components/Registration';
import Authentication from '../components/Authentication';

import * as Actions from '../actions/cards';

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
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

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
    actions: bindActionCreators(Actions, dispatch)
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
    chrome.runtime.sendMessage({from: "app", subject: "logoutUser" })
  }

  handleWipe = event => {
    this.props.actions.deleteAll()
  }

  render() {
    
    const { user, cards, temps, actions } = this.props;

    const isLoggedIn = temps.masterKey
    const isRegistered = user.wrappedKey
    
    const logoutMenuItem = () => {
      if (isLoggedIn) return (
          <MenuItem primaryText="Logout" onTouchTap={ this.handleLogout }/>
      )
    }

    const backButton = () => {
      if (this.props.children){
        return (
            <IconButton onTouchTap={hashHistory.goBack} >
            <NavigationArrowBack/>
            </IconButton>
        )
      } else {
        return (
            <IconButton><span/></IconButton>
        )
      }
    }

    var mainMenu =
        (
	    <IconMenu iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
	    }
	  targetOrigin={{horizontal: 'right', vertical: 'top'}}
	  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
	    >
            { logoutMenuItem() }
              
            <MenuItem primaryText="Preferences" onTouchTap={ () => { hashHistory.push("/settings") } }/>
            <MenuItem primaryText="Erase All Data" onTouchTap={ this.handleWipe }/>
	    </IconMenu>
        );
    
    const Body = () => {
      if (isLoggedIn ) {
        return this.props.children || (
            <CardsList cards={cards}  actions={actions} />
        )
      } else if (isRegistered) {
        return (
            <div style={ { margin: "40px" } }>
            <div>Please authenticate</div>
            <Authentication onSave={this.handleLogin} user={user}/>
            </div>
        )
      } else {
        return (
            <div>
            <div style={{fontSize: "100%", margin: "20px"}}>
            <h2>Welcome to <em>KeyCache</em>, the secure, open source password manager.</h2>
            <p>On the next screen you'll be asked to come up with a username and a pass phrase</p>
<p>The pass phrase will be used to secure all the data that KeyCache manages for you. KeyCache doesn't store the pass phrase, so if you lose or forget it, KeyCache won't be able to recover it. You'll want to invent a pass phrase that is possible for you to remember but impossible for others to guess.</p>
            <p>To get started, click the "REGISTER" button, below</p>
            </div>
            <Registration onSave={this.handleRegister} />
            </div>
        )
      }
    }

    return (
        <div>
	<MuiThemeProvider muiTheme={muiTheme} >
        <div style={styles.container}>
        <AppBar
      title="KeyCache"
      iconElementLeft={ backButton() }
      iconElementRight={ mainMenu } />
        <Body />
        </div>
        </MuiThemeProvider>
	</div>
    );
  }
}
