import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import CardView from './CardView'

/**
 * Floating action button connected to Dialog for creating a new card
 */
export default class CardCreateDialog extends React.Component {

  static propTypes = {
    onSave:  PropTypes.func.isRequired,
    card: PropTypes.object
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

  handleSubmit = (card) => {
    console.log("wanna save card:", card);
    this.setState({open: false});
    this.props.onSave(card);
  };

  render() {

    const fabStyle = {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 20,
      left: 'auto',
      position: 'fixed',
    };

    var dialog
    if (this.state.open) {
      dialog = (
          <CardView onSave={this.handleSubmit} onCancel={this.handleClose} viewMode="create" />
      );
    }
    return (
      <div>
        <FloatingActionButton  style={ fabStyle } onTouchTap={this.handleOpen.bind(this)}>
          <ContentAdd />
        </FloatingActionButton>
        { dialog }
      </div>
    );
  }
}
