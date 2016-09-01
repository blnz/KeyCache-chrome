import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import CopyToClipboard from 'react-copy-to-clipboard';
import Divider from 'material-ui/Divider';

import FontIcon from 'material-ui/FontIcon';
import {red500, yellow500, blue500} from 'material-ui/styles/colors';

const iconStyles = {
  margin: 20,
};

const miniIconStyles = {
  width: 36,
  height: 36,
  padding: "0px",
}


/**
 * Dialog for interacting with a card
 * supports create, edit and view modes
 */
export default class CardView extends React.Component {
  
  static propTypes = {
    onSave:  PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired, 
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    viewMode: PropTypes.string.isRequired,
    card: PropTypes.object
  };

  state = { card: { clear: {} } }

  componentWillReceiveProps = (props) => {
    const { clear } = props.card
    console.log("got props:", props)
    this.setState( { clear } )
  }

  componentWillMount = () => {
    console.log( "willMount with props:", this.props )
    const { clear } = this.props.card
    this.setState( { clear } )
  }
  
  handleEdit = () => {
     this.props.onEdit(this.props.card)
  }

  handleDelete = () => {
     this.props.onDelete(this.props.card)
  }

  handleShowPassword = () => {
    this.setState( { showPassword: true })
  }

  handleHidePassword = () => {
    this.setState( { showPassword: false })
  }

  handleGeneratePassword = () => {
    // coming real soon, now
  }

  handleCopy = () => {

  }
  
  handleCancel = () => {
    this.props.onCancel()
  };

  handleSubmit = () => {
    const { clear } = this.state
    this.props.onSave(Object.assign({}, this.props.card, { clear } ) )
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

    const vaStyle = {
      textAlign: "right"
    }

    const copyField = (value) => {
      return(
          <div style={{display: "inline-block" }}>
          <IconButton  style={miniIconStyles} tooltip="copy">
          <CopyToClipboard text={value}>
          <FontIcon className="material-icons">content_copy</FontIcon>
          </CopyToClipboard>
          </IconButton>
          </div>
      )
    }
      
    const usernameField = () => {
      return (
          <div>
          {copyField(clear.username)}
          <TextField
        hintText="jane@example.com"
        floatingLabelText="Username"
        disabled={disabled}
        defaultValue={clear.username}
        onChange={ e => {var clear = Object.assign({}, this.state.clear, {username: e.target.value});
                         this.setState({clear});} }
        id="username"
          />

          </div>
      )
    }
    
    const passwordField = () => {
      const hideShow = this.state.showPassword ?
            (
                <IconButton  style={iconStyles} tooltip="hide"
              onTouchTap={this.handleHidePassword}>
                <FontIcon className="material-icons">visibility_off</FontIcon>
                </IconButton>
            ) : (
                <IconButton  style={iconStyles} tooltip="show"
              onTouchTap={this.handleShowPassword}>
                <FontIcon className="material-icons">visibility</FontIcon>
                </IconButton>
            )
      
      return (
          <div>
          {copyField(clear.password)}
          <TextField
        hintText="Password Field"
        floatingLabelText="Password"
        type={this.state.showPassword ? "text" : "password"}
        disabled={disabled}
        defaultValue={clear.password}
        onChange={ e => {var clear = Object.assign({}, this.state.clear, {password: e.target.value});
                         this.setState({clear});} }
        id="password"
          />
          <div style={{display: "inline-block" }}>{hideShow}</div>
          </div>
      )
    }
    
    const ViewTitle = () => {
      if (this.props.viewMode === "view") {
        return ( 
            <div style={vaStyle}>
            <IconButton  style={iconStyles} tooltip="edit"   onTouchTap={this.handleEdit}>
            <FontIcon className="material-icons">create</FontIcon>
            </IconButton>
            <IconButton  style={iconStyles} tooltip="delete"  onTouchTap={this.handleDelete}>
            <FontIcon className="material-icons">delete</FontIcon>
            </IconButton>
            <IconButton   style={iconStyles} tooltip="close" onTouchTap={this.handleCancel}>
            <FontIcon className="material-icons">clear</FontIcon>
            </IconButton>
            </div>
          );
      } else {
        return (
            <div />
        )
      }
    }

    const { clear } = this.state

    const disabled = "view" === this.props.viewMode
    return (

        <Dialog
      title={ this.props.viewMode === "create" ? "New Card" : <ViewTitle /> }
              actions={ actions }
              modal={false}
              open={true}
              onRequestClose={this.handleCancel}
              autoScrollBodyContent={true}
              >
      <TextField
      hintText="Card name"
      floatingLabelText="Name"
      disabled={disabled}
      defaultValue={clear.name}
      onChange={ e => {var clear = Object.assign({}, this.state.clear, {name: e.target.value} );
                       this.setState({ clear });} }
      id="name"
      /><br />
      <TextField
      hintText="www.example.com"
      floatingLabelText="URL"
      disabled={disabled}
      defaultValue={clear.url}
      onChange={ e => {var clear = Object.assign({}, this.state.clear, {url: e.target.value});
      this.setState({clear});} }
      id="url"
        /><br />
        { usernameField() }
        <br />
        { passwordField() }
      <br />
      <TextField
      hintText="MultiLine with rows: 2 and rowsMax: 4"
      multiLine={true}
      floatingLabelText="Notes"
      disabled={disabled}
      defaultValue={clear.note}
      onChange={ e => {var clear = Object.assign({}, this.state.clear, {note: e.target.value});
      this.setState({clear});} }
      id="note"
      rows={2}
      rowsMax={4}
      />
      </Dialog>
    );
  }
}
