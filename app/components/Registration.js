import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

/**
 * Dialog for registering a new account
 */
export default class Registration extends React.Component {

  static propTypes = {
    onSave:  PropTypes.func.isRequired,
  };

  state = {
    open: false,
    mismatch: false,
    userData: {}
  };

  handleOpen = () => {
    this.setState({open: true,
                   mismatch: false,
                   userData : {}});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSubmit = () => {
    if (this.state.userData.passphrase === this.state.userData.passphrase2) { 
      this.setState({open: false});
      this.props.onSave(this.state.userData);
    } else {
      this.setState( {mismatch: true} )
    }
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

    const mismatchAlert = () => {
      if (this.state.mismatch) {
        return (
            <p>mismatch</p>
        )
      }
    }

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
      style={{ width: "90%"}}
      hintText="Pass Phrase"
      floatingLabelText="Pass Phrase"
      onChange={ e => {
        var userData = Object.assign({}, this.state.userData, {passphrase: e.target.value});
        this.setState({userData}); } }
      id="passphrase"
        />
        <br />
        <TextField
      hintText="Pass Phrase"
      style={{ width: "90%"}}
      floatingLabelText="Confirm Pass Phrase"
      errorText={this.state.mismatch && "pass phrases don't match"}
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
