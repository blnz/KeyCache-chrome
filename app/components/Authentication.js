import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

/**
 * Dialog for authenticating
 */
export default class Authentication extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired
  };

  state = {
    open: true,
    userData: {}
  };

  handleOpen = () => {
    this.setState({
      open: true,
      userData: {}
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    this.setState({ open: false });
    this.props.onSave(this.state.userData);
  };

  render() {
    const actions = [<FlatButton
                     label="Cancel"
                     onTouchTap={this.handleClose}
                     />,
                     <FlatButton
                     label="Login"
                     onTouchTap={this.handleSubmit}
                     />,
                    ];

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
        const userData = Object.assign({}, this.state.userData, {username: e.target.value});
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
