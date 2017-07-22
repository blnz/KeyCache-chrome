import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import FlatButton from 'material-ui/FlatButton';

export default class FileDrop extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    validator: PropTypes.func,
    label: PropTypes.string.isRequired
  }

  state = {
    open: false,
    fileData: {}
  }

  onDrop = (files) => {
    //    console.log('Received files: ', files)
    if (this.props.validator) {
      //      console.log("calling validator")
      this.props.validator(files)
        .then((contents) => {
          // console.log("got contents", contents)
          this.setState({
            fileData: files,
            fileObj: contents,
            isValid: true
          });
        })
        .catch((err) => {
          // console.log("not valid")
        });
    } else {
      this.setState({
        fileData: files,
        isValid: true
      });
    }
    this.setState({ fileData: files });
  }

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    const fileData = undefined;
    const isValid = false;
    this.setState({ open: false, fileData, isValid });
  }

  handleSubmit = () => {
    // console.log("calling onSave with", this.state.fileObj)
    this.props.onSave(this.state.fileObj);
    this.handleClose();
  }

  render() {
    const dzStyle = {
      width: 300,
      height: 200,
      borderWidth: 2,
      borderColor: '#666',
      borderStyle: 'dashed',
      borderRadius: 5,
      backgroundColor: '#ddd'
    };

    const dzActiveStyle = {
      borderStyle: 'solid',
      backgroundColor: '#eee'
    };

    const dzRejectStyle = {
      borderStyle: 'solid',
      backgroundColor: '#ffdddd'
    };

    const dropStyle = {
      margin: '60px',
      textAlign: 'center'
    };

    const actions = [
      <FlatButton
        label="Cancel"
        key={1}
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="save"
        key={2}
        primary
        disabled={!this.state.isValid}
        onTouchTap={this.handleSubmit}
      />,
    ];

    if (this.state.open) {
      return (
          <div>
          
          <FlatButton
        label={this.props.label}
        disabled={true}
          />

          <div>
          <Dropzone onDrop={this.onDrop} style={dzStyle} activeStyle={dzActiveStyle}
        rejectStyle={dzRejectStyle} >
          <div style={ dropStyle } >Drop file here, or click to select file to upload.</div>
          </Dropzone>
          </div>
          { actions }
        </div>
      )
    } else {
      return (
        
          <FlatButton
        label={this.props.label}
        primary={true}
        onTouchTap={ this.handleOpen } />
      )
    }
  }
}
