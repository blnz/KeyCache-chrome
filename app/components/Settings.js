import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import * as Actions from '../actions/cards';

import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

import { connect }            from 'react-redux';

@connect(
  state => ({
    settings: state.settings
  }),
  dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
  })
)

export default class Settings extends React.Component {
  render() {
    console.log("renering with prps", this.props)
    return (
        <div style={{margin: "10px", maxWidth: "300px"}}>
        <h1>Settings</h1>
        <TextField
      id="syncServer"
      defaultValue={this.props.settings.syncServerHost}
      floatingLabelText="Syncronization Server"
      floatingLabelFixed={true}
    /><br />
    <Toggle
      label="Sync with Cloud"
      toggled={this.props.settings.useSyncServer}
      onToggle={this.props.actions.useSyncServerToggle}
    />

      </div>
    );
  }
}
