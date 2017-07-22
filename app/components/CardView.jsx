import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import CopyToClipboard from 'react-copy-to-clipboard';
import FontIcon from 'material-ui/FontIcon';

import randomString from '../utils/simplePassword';

const iconStyles = {
  margin: '15px'
};

const miniIconStyles = {
  width: 36,
  height: 36,
  padding: '0px',
  margin: '6px'
};


/**
 * Dialog for interacting with a card
 * supports create, edit and view modes
 */
export default class CardView extends React.Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    viewMode: PropTypes.string.isRequired,
    card: PropTypes.object.isReqired
  };

  state = { card: { clear: {} } }

  componentWillMount = () => {
    const { clear } = this.props.card;
    this.setState({ clear });
  }

  componentWillReceiveProps = (props) => {
    const { clear } = props.card;
    this.setState({ clear });
  }

  handleEdit = () => {
    this.props.onEdit(this.props.card);
  }

  handleDelete = () => {
    this.props.onDelete(this.props.card);
  }

  handleShowPassword = () => {
    this.setState({ showPassword: true });
  }

  handleHidePassword = () => {
    this.setState({ showPassword: false });
  }

  handleGeneratePassword = () => {
    // coming real soon, now
    const generated = randomString(16);
    const clear = Object.assign({}, this.state.clear, { password: generated });
    this.setState({ clear });
  }

  handleCopy = () => {
    // ummm ...
  }

  handleCancel = () => this.props.onCancel();

  handleSubmit = () => {
    const { clear } = this.state;
    this.props.onSave(Object.assign({}, this.props.card, { clear }));
  };

  render() {
    const disabled = this.props.viewMode === 'view';

    const { clear } = this.state;

    const actions = this.props.viewMode !== 'view' ? [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleCancel}
      />,
      <FlatButton
        label="Save"
        primary
        onTouchTap={this.handleSubmit}
      />,
    ] : [];

    const vaStyle = {
      textAlign: 'right'
    };

    const updateClearState = (name, val) => {
      const clear = Object.assign({}, this.state.clear, { [name]: val });
      this.setState({ clear });
    };

    const copyField = value => (
      <div style={{ display: 'inline-block' }}>
        <IconButton
          style={miniIconStyles}
          tooltip="copy"
          tabIndex={-1}
        >
          <CopyToClipboard text={value}>
            <FontIcon className="material-icons">content_copy</FontIcon>
          </CopyToClipboard>
        </IconButton>
      </div>
    );

    const usernameField = () => (
      <div>
        {copyField(this.state.clear.username)}
        <TextField
          hintText="jane@example.com"
          floatingLabelText="Username"
          disabled={disabled}
          defaultValue={this.state.clear.username}
          onChange={e => updateClearState('username', e.target.value)}
          id="username"
        />
      </div>
    );

    const passwordField = () => {
      const hideShow = this.state.showPassword ?
        (
          <IconButton
            style={miniIconStyles}
            tooltip="hide"
            tabIndex={-1}
            onTouchTap={this.handleHidePassword}
          >
            <FontIcon className="material-icons">visibility_off</FontIcon>
          </IconButton>
        ) : (
          <IconButton
            style={miniIconStyles}
            tooltip="show"
            tabIndex={-1}
            onTouchTap={this.handleShowPassword}
          >
            <FontIcon className="material-icons">visibility</FontIcon>
          </IconButton>
        );

      const generatePassword =
        this.props.viewMode !== 'view' ?
          (
            <IconButton
              style={miniIconStyles}
              tooltip="generate"
              tabIndex={-1}
              onTouchTap={this.handleGeneratePassword}
            >
              <FontIcon className="material-icons">autorenew</FontIcon>
            </IconButton>
          ) : (
            ''
          );

      return (
        <div>
          {copyField(this.state.clear.password)}
          <TextField
            style={{ width: '50%' }}
            hintText="Password Field"
            floatingLabelText="Password"
            type={this.state.showPassword ? 'text' : 'password'}
            disabled={disabled}
            defaultValue={this.state.clear.password}
            value={this.state.clear.password}
            onChange={e => updateClearState('password', e.target.value)}
            id="password"
          />
          <div style={{ display: 'inline-block' }}>{hideShow}</div>
          <div style={{ display: 'inline-block' }}>{generatePassword}</div>
        </div>
      );
    };

    const ViewTitle = () => {
      if (this.props.viewMode === 'view') {
        return (
          <div>
            <h1 style={{ float: 'left', margin: '20px' }} >{this.state.clear.name}</h1>
            <div style={vaStyle}>
              <IconButton style={iconStyles} tooltip="edit" onTouchTap={this.handleEdit}>
                <FontIcon className="material-icons">create</FontIcon>
              </IconButton>
              <IconButton style={iconStyles} tooltip="delete" onTouchTap={this.handleDelete}>
                <FontIcon className="material-icons">delete</FontIcon>
              </IconButton>
              <IconButton style={iconStyles} tooltip="close" onTouchTap={this.handleCancel}>
                <FontIcon className="material-icons">clear</FontIcon>
              </IconButton>
            </div>
          </div>
        );
      }
      return (
        <div />
      );
    };

    return (
      <Dialog
        title={this.props.viewMode === 'create' ? 'New Card' : <ViewTitle />}
        actions={actions}
        modal={false}
        open
        onRequestClose={this.handleCancel}
        autoScrollBodyContent
      >
        <TextField
          style={{ width: '90%' }}
          hintText="Card name"
          floatingLabelText="Name"
          disabled={disabled}
          defaultValue={this.state.clear.name}
          onChange={e => updateClearState('name', e.target.value)}
          id="name"
        />
        <br />
        <TextField
          style={{ width: '90%' }}
          hintText="www.example.com"
          floatingLabelText="URL"
          disabled={disabled}
          defaultValue={this.state.clear.url}
          onChange={e => updateClearState('url', e.target.value)}
          id="url"
        />
        <br />
        { usernameField() }
        <br />
        { passwordField() }
        <br />
        <TextField
          style={{ width: '90%' }}
          multiLine
          floatingLabelText="Notes"
          disabled={disabled}
          defaultValue={this.state.clear.note}
          onChange={e => updateClearState('note', e.target.value)}
          id="note"
          rows={3}
          rowsMax={8}
        />
      </Dialog>
    );
  }
}
