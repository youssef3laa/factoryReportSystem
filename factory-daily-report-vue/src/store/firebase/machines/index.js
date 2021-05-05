import getter from "./getters.js";
import actions from "./actions.js";

const store = {
  state: {
    machinesRef: 'firebase.firestore().collection("machines")',
  },
  getters: getter,
  actions: actions,
};

export default store;
