export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    //    console.log("serialized state is:", serializedState);
    return JSON.parse(serializedState);
  } catch (err) {
    console.log("caught:", err);
    return undefined;
  }
};

const encryptedCards = (cards) => {
  // remove the clear data since we only store encrypted 
  return (
    cards.map( (card) => { return {id: card.id, version: card.version, encrypted: card.encrypted} } )
  );
}

export const saveState = (state) => {
  try {

    const cards = encryptedCards(state.cards)
    const savable = { user: state.user, cards }
    const serializedState = JSON.stringify(savable);

    localStorage.setItem('state', serializedState);

  } catch (err) {
    console.log("failed to stringify state");
  }
};
