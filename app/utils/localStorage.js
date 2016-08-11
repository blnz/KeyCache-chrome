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

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    console.log("saving serialized:", serializedState);
    localStorage.setItem('state', serializedState);
    var sample = new Uint8Array(100);
    crypto.getRandomValues(sample);
    console.log("sample", sample);
    console.log("getting it back from local storage yeilds", localStorage['state']);
  } catch (err) {
    console.log("failed to stringify state");
  }
};
