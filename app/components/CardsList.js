import React, { PropTypes, Component } from 'react';

import {List, ListItem} from 'material-ui/List';

import CardCreateDialog from './CardCreateDialog';
import CardViewDialog from './CardViewDialog';
import TextField from 'material-ui/TextField';
    
const searchFilter = (str) => {
  return card => {
    return card.clear.name.includes(str)
  }
}

export default class CardsList extends Component {
  
  static propTypes = {
    cards: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  state = {
    activeCard: false,
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
      console.log("card", card)
      
      
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
    
    const filteredCards = this.state.search ?
          this.state.search.length > 0 ?
          this.props.cards.filter(searchFilter(this.state.search)) :
          this.props.cards :
          this.props.cards

    const sortedCards = filteredCards.sort( (a, b) => {
      return a.clear.name.localeCompare(b.clear.name);
    })
          
    
    return (
        <div>
        <TextField
      floatingLabelText="search"
      onChange={ e => { this.setState( {search: e.target.value} );} }
      id="username"
        />
        
        <List>
        {  sortedCards.map( card => { return this.cardListItem(card) } ) } 
      </List>
        { viewDialog }
        <CardCreateDialog onSave={this.handleCreate}/> 
        </div>
    );
  }
}
