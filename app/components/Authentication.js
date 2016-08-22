import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

/**
 * Dialog for authenticating
 */
export default class Authentication extends React.Component {

  static propTypes = {
    onSave:  PropTypes.func.isRequired,
    user:    PropTypes.object.isRequired
  };

  state = {
    open: true,
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
        label="Login"
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
      label="Authenticate"
      primary={true}
      onTouchTap={this.handleOpen}
        />
        
        <Dialog
      title="Authentication"
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
        this.setState({userData});} }
      id="username"
        />
        <br />
        <TextField
      hintText="Pass Phrase"
      floatingLabelText="Pass Phrase"
      type="password"
      onChange={ e => {
        const userData = Object.assign({}, this.state.userData, {passphrase: e.target.value});
        this.setState({userData});} }
      id="passphrase"
        />
        </Dialog>
        </div>
    );
  }
}
