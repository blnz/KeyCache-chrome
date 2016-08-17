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
export default class CardView extends React.Component {

  
  static propTypes = {
    onSave:  PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired, 
    // onEdit: PropTypes.func.isRequired, 
    // onDelete: PropTypes.func.isRequired, 
    viewMode: PropTypes.string.isRequired,
    card: PropTypes.object
  };

  state = { card: {} }

  componentWillReceiveProps = (props) => {
    console.log("got props:", props)
  }
  
  handleEdit = () => {
    // umm
  }

  handleDelete = () => {
    // umm
  }
  handleCancel = () => {
    this.props.onCancel()
  };

  handleSubmit = () => {
    this.props.onSave(this.state.card);
  };

  render() {

    const actions = this.props.viewMode != "view" ? [
        <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.handleCancel}
        />,
        <FlatButton
      label="Save"
      primary={true}
      keyboardFocused={true}
      onTouchTap={this.handleSubmit}
        />,
    ] : [] ;
    
    return (

        <Dialog
      title={ this.props.viewMode === "create" ? "New Card" : "" }
              actions={actions}
              modal={false}
              open={true}
              onRequestClose={this.handleCancel}
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
    );
  }
}
