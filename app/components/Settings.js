import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import * as Actions from '../actions/cards';

import DownloadLink from './DownloadLink';

import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';

import { connect }            from 'react-redux';

@connect(
  state => ({
    settings: state.settings,
    cards: state.cards
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
        <div>
        <h3>Synchronization</h3>
        <Toggle
      label="Allow syncing with cloud"
      toggled={this.props.settings.useSyncServer}
      onToggle={this.props.actions.useSyncServerToggle}
        />
        
        <TextField
      id="syncServer"
      defaultValue={this.props.settings.syncServerHost}
      floatingLabelText="Server Host"
      onKeyDown={ (event) => {
        if (event.keyCode == 13) {
          this.props.actions.setSyncServerHost(event.target.value)
        }
      }
                }
      floatingLabelFixed={true}
        /><br />
        </div>
        <Divider />
        <div>
        <h3>Backups and Exports</h3>
        <DownloadLink
      label="export cards"
      filename="cards.json"
      exportFile={
        () =>  JSON.stringify(this.props.cards.map(
          card => { return { id: card.id, version: card.version, clear: card.clear } }
        ), null, 4)
      } />
        <DownloadLink
      label="make backup"
      filename="backup.json"
      exportFile={() =>  localStorage.getItem('state') }
      />
        </div>
        
      </div>
    );
  }
}
