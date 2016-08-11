import React, { PropTypes, Component } from 'react';
import {List, ListItem} from 'material-ui/List';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import CardCreateDialog from './CardCreateDialog';

export default class CardsList extends Component {

    static propTypes = {
        cards: PropTypes.array.isRequired,
        actions: PropTypes.object.isRequired
    };
    
    handleSave = card => {
        console.log("handleSave for card:", card);
        this.props.actions.addCard(card);
    };

    render() {
        console.log("render", this.props)

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
