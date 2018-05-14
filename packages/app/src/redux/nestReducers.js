export default function nestReducers(nestedReducers) {
  function getUndefinedStateErrorMessage(outerKey, innerKey, action) {
    const actionType = action && action.type;
    const actionDescription =
      (actionType && `action "${String(actionType)}"`) || 'an action';

    return (
      `Given ${actionDescription}, nested reducer "${outerKey} > ${innerKey}" ` +
      `returned undefined. To ignore an action, you must explicitly return the ` +
      `previous state. If you want this reducer to hold no value, you can return` +
      ` null instead of undefined.`
    );
  }

  return function combination(state = {}, action) {
    let hasChanged = false;
    const nextState = {};
    Object.entries(nestedReducers).forEach(([outerKey, reducers]) => {
      Object.entries(reducers).forEach(([innerKey, reducer]) => {
        const previous = state[outerKey] && state[outerKey][innerKey];
        const next = reducer(previous, action);
        if (typeof next === 'undefined') {
          throw new Error(
            getUndefinedStateErrorMessage(outerKey, innerKey, action),
          );
        }
        nextState[outerKey] = nextState[outerKey] || {};
        nextState[outerKey][innerKey] = next;
        hasChanged = hasChanged || next !== previous;
      });
    });
    return hasChanged ? nextState : state;
  };
}
