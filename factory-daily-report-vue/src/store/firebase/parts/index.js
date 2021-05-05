import getter from "./getters.js";
import actions from "./actions.js";

const store = {
  state: {
    partsRef: 'firebase.firestore().collection("parts")',
  },
  getters: getter,
  actions: actions,
};

export default store;
