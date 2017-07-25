import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';

import CardView from './CardView';

export default class CardViewDialog extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    card: PropTypes.shape({ clear: PropTypes.object }).isRequired
  };

  state = {
    open: true,
    viewMode: 'view',
    card: {}
  };

  componentWillMount = () => this.setState({ open: true });

  componentWillReceiveProps = props =>
    this.setState({ open: true, card: props.card });

  handleEdit = () => this.setState({ viewMode: 'edit' });

  handleDelete = (card) => {
    this.props.onDelete(card);
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({
      open: true,
      card: {}
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
      viewMode: 'view',
      card: {}
    });
    this.props.onClose();
  };

  handleSubmit = (card) => {
    this.setState({ open: false });
    this.props.onSave(card);
  };

  render() {
    let dialog;
    if (this.state.open) {
      dialog = (
        <div>
          <CardView
            onSave={this.handleSubmit}
            onCancel={this.handleClose}
            onDelete={this.handleDelete}
            viewMode={this.state.viewMode}
            onEdit={this.handleEdit}
            card={this.props.card}
          />
        </div>
      );
    }

    return (
      <div>
        { dialog }
      </div>
    );
  }
}
