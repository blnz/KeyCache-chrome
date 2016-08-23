import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

/**
 * Dialog for registering a new account
 */
export default class Registration extends React.Component {

  static propTypes = {
    onSave:  PropTypes.func.isRequired,
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
    this.setState({open: false});
  };

  handleSubmit = () => {
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
        this.setState({userData}); } }
      id="username"
        />
        <br />
        <TextField
      hintText="Pass Phrase"
      floatingLabelText="Pass Phrase"
      type="password"
      onChange={ e => {
        var userData = Object.assign({}, this.state.userData, {passphrase: e.target.value});
        this.setState({userData}); } }
      id="passphrase"
        />
        <br />
        <TextField
      hintText="Pass Phrase"
      floatingLabelText="Confirm Pass Phrase"
      type="password"
      onChange={ e => {
        var userData = Object.assign({}, this.state.userData, {passphrase2: e.target.value});
        this.setState({userData});}
               }
      id="passphrase2"
        />
        <br />
        </Dialog>
        </div>
    );
  }
}
