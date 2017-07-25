import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/cards';
import CardViewDialog from './CardViewDialog';

@connect(
  state => ({
    cards: state.cards
  }),
  dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
  })
)

export default class Card extends Component {
  static propTypes = {
    params: PropTypes.shape({ cardId: PropTypes.string }).isRequired,
    actions: PropTypes.shape({
      updateCard: PropTypes.function,
      deleteCard: PropTypes.function
    }).isRequired
  };


  handleCardSave = (card) => {
    this.props.actions.updateCard(card);
    this.setState({ activeCard: false });
  }

  handleCardDelete = (card) => {
    this.props.actions.deleteCard(card);
    this.setState({ activeCard: false });
  }

  handleCardEdit = () =>
    this.setState({ activeCard: false, editCard: true });

  handleViewCancel = () => {
    this.setState({ activeCard: false });
  };

  render() {
    const myCardList = this.props.cards.filter(card => {
      const ret = (card.id === this.props.params.cardId);
      return ret;
    });
    console.log('myCardList', myCardList);
    const myCard = myCardList[0];
    return (
      <div style={{ margin: '10px' }}>
        <h1>yo {this.props.params.cardId}</h1>
        <CardViewDialog
          onSave={this.handleCardSave}
          onDelete={this.handleCardDelete}
          onEdit={this.handleCardEdit}
          onClose={this.handleViewCancel}
          card={myCard}
        />
      </div>
    );
  }
}
