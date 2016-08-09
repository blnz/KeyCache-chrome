import React, { PropTypes, Component } from 'react';

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
    return (
      <div>
        <h2>KeyCache</h2>
      </div>
    );
  }
}
