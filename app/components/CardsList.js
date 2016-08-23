import React, { PropTypes, Component } from 'react';

import {List, ListItem} from 'material-ui/List';

import CardCreateDialog from './CardCreateDialog';
import CardViewDialog from './CardViewDialog';

export default class CardsList extends Component {
  
  static propTypes = {
    cards: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  state = {
    activeCard: false
  }
  
  handleCreate = card => {
    this.props.actions.addCard(card.clear);
  }
  
  handleCardOpen = card => {
    this.setState( { activeCard: card, cardMode: "view" } )
  }
  
  handleCardSave = card => {
    this.props.actions.updateCard(card)
    this.setState({ activeCard: false})
  }

  handleCardDelete = card => {
    this.props.actions.deleteCard(card)
    this.setState({ activeCard: false})
  }

  handleCardEdit = card => {
    this.setState({ activeCard: false,
                    editCard: true
                  })
  }

  cardListItem = card => {
    if (card.clear && card.clear.name) {
      const children = (
          <div>
          <span>foo</span>
          <br />
          <span>bar</span>
        </div>
      )
      
      return (
          <ListItem primaryText={card.clear.name}
        secondaryText={card.clear.url ? card.clear.url : undefined}
        onTouchTap={ (e) => { this.handleCardOpen(card) } }
        key={card.id}/>
      );
    }
  }
  
  render() {
    var viewDialog
    if (this.state.activeCard) {
      viewDialog = (
          <CardViewDialog
        card={this.state.activeCard}
        onEdit={this.handleCardSave}
        onDelete={this.handleCardDelete}
        onSave={this.handleCardSave} />
      )
    }
    
    return (
        <div>
        <List>
        {  this.props.cards.map( card => { return this.cardListItem(card) } ) } 
      </List>
        { viewDialog }
        <CardCreateDialog onSave={this.handleCreate}/> 
        </div>
    );
  }
}

         // {  this.props.cards.map( card => {
         //  if (card.clear && card.clear.name) {
         //    return (
         //        <ListItem primaryText={card.clear.name}
         //      onTouchTap={ (e) => { this.handleCardOpen(card) } }
         //      key={card.id}/>
         //    );
         //  }
         // } ) }
