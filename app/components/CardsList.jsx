import React, { PropTypes, Component } from 'react';
import { hashHistory } from 'react-router';

import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import CardCreateDialog from './CardCreateDialog';
import CardViewDialog from './CardViewDialog';

const searchStyle = {
  fontSize: '16px',
  lineHeight: '24px',
  width: '90%',
  height: '72px',
  display: 'inline-block',
  position: 'relative',
  marginLeft: '40px',
  fontFamily: 'Roboto, sans-serif',
  transition: 'height 200ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
  backgroundColor: 'transparent'
};

const searchFilter = str => card => card.clear.name.includes(str);

export default class CardsList extends Component {
  static propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
    actions: PropTypes.object.isRequired
  };

  state = {
    activeCard: false,
    search: false
  };

  handleCreate = card => this.props.actions.addCard(card.clear);

  handleCardOpen = card =>
    hashHistory.push(`/card/${card.id}`);
  //    this.setState({ activeCard: card, cardMode: 'view' });

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
  }

  cardListItem = (card) => {
    if (card.clear && card.clear.name) {
      return (
        <div key={card.id}>
          <ListItem
            primaryText={card.clear.name}
            secondaryText={card.clear.url ? card.clear.url : undefined}
            onTouchTap={() => { this.handleCardOpen(card); }}
          />
          <Divider />
        </div>
      );
    }
  };

  render() {
    let viewDialog;
    if (this.state.activeCard) {
      viewDialog = (
        <CardViewDialog
          card={this.state.activeCard}
          onEdit={this.handleCardSave}
          onClose={this.handleViewCancel}
          onDelete={this.handleCardDelete}
          onSave={this.handleCardSave}
        />
      );
    }

    let filteredCards = this.props.cards.filter(card => card.clear);

    if (this.state.search && this.state.search.length > 0) {
      filteredCards = this.props.cards.filter(searchFilter(this.state.search));
    }

    const sortedCards =
          filteredCards.sort((a, b) => a.clear.name.localeCompare(b.clear.name));

    return (
      <div>
        <TextField
          style={searchStyle}
          floatingLabelText={'search'}
          onChange={e => this.setState({ search: e.target.value })}
          id={'username'}
        />
        <List>
          { sortedCards.map(card => this.cardListItem(card)) }
        </List>
        { viewDialog }
        <CardCreateDialog onSave={this.handleCreate} />
      </div>
    );
  }
}
