import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import FlatButton from 'material-ui/FlatButton';

import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';

import { connect } from 'react-redux';

import FileDrop from './FileDrop';

import * as Actions from '../actions/cards';

import DownloadLink from './DownloadLink';

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
  // ensure files is an array of length 1 and that we can parse the first as JSON
  getJsonFile = (files) => {
    if (!(files instanceof Array)) {
      return false;
    } else if (files.length !== 1) {
      return false;
    }
    try {
      console.log(files[0]);
      console.log(files[0].name);
      console.log(files[0].value);
      return true;
    } catch (e) {
      return false;
    }
  }

  handleWipe = () =>
    this.props.actions.deleteAll();

    validateCardsImport = files => {
    return new Promise( function (resolve, reject) {
      if (! files instanceof Array) {
        reject("not array");
      } else if (files.length != 1) {
        reject("too long");
      } else {

        var fr = new FileReader();
        fr.onload = function() {
          // use fr.result here
          console.log(fr.result)
          var data = fr.result.replace(/data:(.*);base64,/i, "");
          console.log("trimmed result", data)
          data = window.atob(data);
          try {
            data = JSON.parse(data);
            resolve(data)
          } catch (ex) {
            reject(ex)
          }
        }
        fr.readAsDataURL(files[0]);
      }
    })
  }

  render() {

    const syncServer = () => {
      // disable for published release
      if (false) {
        return (
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
        )   
      }
      
    }
  
    return (
        <div style={{margin: "10px", maxWidth: "300px"}}>
        <h1>Settings</h1>
        
        <Divider />
        <div>
        <h3>Backups and Exports</h3>
        <div style={{margin: "10px"}}>
        <DownloadLink
      label="export cards"
      filename="cards.json"
      exportFile={
        () =>  JSON.stringify(this.props.cards.map(
          card => { return { id: card.id, version: card.version, clear: card.clear } }
        ), null, 4)
      } />
        <br />
        <FileDrop label="import cards" onSave={ this.props.actions.importCards }
         validator={ this.validateCardsImport } />
      
      </div>
        <Divider />
        <div style={{margin: "10px"}}>
        <DownloadLink
      label="make encrypted backup"
      filename="backup.json"
      exportFile={() =>  localStorage.getItem('state') }
        />
        <FileDrop label="restore from backup" onSave={ this.props.actions.restoreBackup }
      validator={ this.validateCardsImport } />
      </div>
        </div>
        <Divider />
        <div>
        <h3>Reset</h3>
        <FlatButton
      label="Full Erase"
      primary={true}
      onTouchTap={this.handleWipe} />
        </div>
        </div>
    );
  }
}
