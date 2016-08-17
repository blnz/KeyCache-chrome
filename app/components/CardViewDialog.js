import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';

import CardView from './CardView'

/**
 * Floating action button connected to Dialog for creating a new card
 */
export default class CardViewDialog extends React.Component {

  static propTypes = {
    onSave:  PropTypes.func.isRequired,
    onDelete:  PropTypes.func.isRequired,
    onEdit:  PropTypes.func.isRequired,
    card: PropTypes.object.isRequired
  };

  state = {
    open: true,
    card: {}
  };

  componentWillReceiveProps = (props) => {
    console.log("got props:", props)
    this.setState({open: true,
                   card: props.card });

  }
  
  componentWillMount = () => {
    console.log("will mount")
    this.setState({open: true })
  }
  

  handleOpen = () => {
    this.setState({open: true,
                   card: {}});
  };

  handleClose = () => {
    this.setState({open: false,
                   card: {}});
    this.props.onDelete(this.props.card)    // this.setState({open: false});
  };

  handleSubmit = (card) => {
    console.log("wanna save card:", card);
    this.setState({open: false});
    this.props.onSave(card);
  };

  render() {
    var dialog
    if (this.state.open) {
      dialog = (
          <CardView onSave={this.handleSubmit} onCancel={this.handleClose} viewMode="view" card={this.props.card} />
      );
    }
    return (
      <div>
        { dialog }
      </div>
    );
  }
}
