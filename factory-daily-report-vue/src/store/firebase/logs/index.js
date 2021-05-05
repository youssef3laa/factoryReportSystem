import getter from "./getters.js";
import actions from "./actions.js";

const store = {
  state: {
    logsRef: 'firebase.firestore().collection("logss")',
  },
  getters: getter,
  actions: actions,
};

export default store;
