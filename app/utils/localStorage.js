export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    console.log("serialized state is:", serializedState);
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

// WebCrypto
//    var sample = new Uint8Array(100);
//    crypto.getRandomValues(sample);
//    console.log("sample", sample);


export const saveState = (state) => {
  try {

    const cards = encryptedCards(state.cards)
    const savable = { user: state.user, cards }
    const serializedState = JSON.stringify(savable);

    //    console.log("saving serialized:", serializedState);

    localStorage.setItem('state', serializedState);

    // console.log("getting it back from local storage yeilds", localStorage['state']);
  } catch (err) {
    console.log("failed to stringify state");
  }
};
