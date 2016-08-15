import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


/**
 * Dialog for registering a new account, or device
 */
export default class Registration extends React.Component {

  static propTypes = {
    onSave:  PropTypes.func.isRequired,
    onTestThunk: PropTypes.func.isRequired
  };

  state = {
    open: false,
    userData: {}
  };

  handleOpen = () => {
    this.setState({open: true,
                   userData : {}});
  };

  handleClose = () => {
    console.log("testing thunker");
    this.props.onTestThunk();
    console.log("tested");
    this.setState({open: false});
  };

  handleSubmit = () => {
    console.log("wanna save userData:", this.state.userData);
    this.setState({open: false});
    this.props.onSave(this.state.userData);
  };

  render() {

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Save"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSubmit}
      />,
    ];
    const fabStyle = {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 20,
      left: 'auto',
      position: 'fixed',
    };

    return (
      <div>
        <FlatButton
          label="Register"
          primary={true}
          onTouchTap={this.handleOpen}
          />

      <Dialog
        title="New Registration"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          >
          <TextField
            hintText="jane@example.com"
            floatingLabelText="Username"
            onChange={ e => {
              var userData = Object.assign({}, this.state.userData, {username: e.target.value});
              console.log(userData);
              this.setState({userData}); console.log(e.target.value, this.state.userData);} }
              id="username"
              />
            <br />
            <TextField
              hintText="Pass Phrase"
              floatingLabelText="Pass Phrase"
              type="password"
              onChange={ e => {
                var userData = Object.assign({}, this.state.userData, {passphrase: e.target.value});
                console.log(userData);
                this.setState({userData}); console.log(e.target.value, this.state.userData);} }
                id="passphrase"
                />
              <br />
              <TextField
                hintText="Pass Phrase"
                floatingLabelText="Confirm Pass Phrase"
                type="password"
                onChange={ e => {
                  var userData = Object.assign({}, this.state.userData, {passphrase2: e.target.value});
                  console.log(userData);
                  this.setState({userData}); console.log(e.target.value, this.state.userData);}
                }
                id="passphrase2"
                />
              <br />
              </Dialog>
            </div>
    );
  }
}