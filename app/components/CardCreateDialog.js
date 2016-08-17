import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

/**
 * Dialog for creating a new card
 */
export default class CardCreateDialog extends React.Component {

  static propTypes = {
    onSave:  PropTypes.func.isRequired,
  };

  state = {
    open: false,
    card: {}
  };

  handleOpen = () => {
    this.setState({open: true,
                   card: {}});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSubmit = () => {
    console.log("wanna save card:", this.state.card);
    this.setState({open: false});
    this.props.onSave(this.state.card);
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
      <FloatingActionButton  style={ fabStyle } onTouchTap={this.handleOpen.bind(this)}>
      <ContentAdd />
      </FloatingActionButton>

      <Dialog
      title="New Card"
      actions={actions}
      modal={false}
      open={this.state.open}
      onRequestClose={this.handleClose}
      autoScrollBodyContent={true}
      >
      <TextField
      hintText="Card name"
      floatingLabelText="Name"

      onChange={ e => {var card = Object.assign({}, this.state.card, {name: e.target.value});
      this.setState({card});} }
      id="name"
      /><br />
      <TextField
      hintText="www.example.com"
      floatingLabelText="URL"
      onChange={ e => {var card = Object.assign({}, this.state.card, {url: e.target.value});
      this.setState({card});} }
      id="url"
      /><br />
      <TextField
      hintText="jane@example.com"
      floatingLabelText="Username"
      onChange={ e => {var card = Object.assign({}, this.state.card, {username: e.target.value});
      this.setState({card});} }
      id="username"
      /><br />
      <TextField
      hintText="Password Field"
      floatingLabelText="Password"
      type="password"
      onChange={ e => {var card = Object.assign({}, this.state.card, {password: e.target.value});
      this.setState({card});} }
      id="password"
      /><br />
      <TextField
      hintText="MultiLine with rows: 2 and rowsMax: 4"
      multiLine={true}
      floatingLabelText="Notes"
      onChange={ e => {var card = Object.assign({}, this.state.card, {note: e.target.value});
      this.setState({card});} }
      id="note"
      rows={2}
      rowsMax={4}
      />
      </Dialog>
      </div>
    );
  }
}
