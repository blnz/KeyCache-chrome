import React, { PropTypes, Component } from 'react';

import {List, ListItem} from 'material-ui/List';

import CardCreateDialog from './CardCreateDialog';

export default class CardsList extends Component {

    static propTypes = {
        cards: PropTypes.array.isRequired,
        actions: PropTypes.object.isRequired
    };
    
    handleSave = card => {
        this.props.actions.addCard(card);
    };

    render() {
        return (
            <div>
            <List>
            { this.props.cards.map( card => {
                if (card.clear && card.clear.name) {
                    return (
                        <ListItem primaryText={card.clear.name}
                        key={card.id}/>
                    );
                }
            } ) }
            </List>
            <CardCreateDialog onSave={this.handleSave}/> 
            </div>
        );
    }
}
