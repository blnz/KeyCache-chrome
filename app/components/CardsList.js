import React, { PropTypes, Component } from 'react';

import {List, ListItem} from 'material-ui/List';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import CardCreateDialog from './CardCreateDialog';

export default class CardsList extends Component {

  static propTypes = {
    addTodo: PropTypes.func.isRequired
    
  };

  handleSave = text => {
    if (text.length !== 0) {
      this.props.addTodo(text);
    }
  };

  render() {

    const style = {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 20,
      left: 'auto',
      position: 'fixed',
    };
      return (
          <div>
            <List>
          { this.props.cards.map( card => {
              console.log("got card", card);
              return (
                  <ListItem primaryText={card.clear.name}
                  key={card.clear.id}/>
                  );
          } ) }
          </List>
          <CardCreateDialog />
          </div>
      );
  }
}
