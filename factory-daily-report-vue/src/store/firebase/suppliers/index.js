import getter from "./getters.js";
import actions from "./actions.js";

const store = {
  state: {
    supplierRef: 'firebase.firestore().collection("suppliers")',
  },
  getters: getter,
  actions: actions,
};

export default store;
