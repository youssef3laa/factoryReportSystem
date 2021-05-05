import getter from "./getters.js";
import actions from "./actions.js";

const store = {
  state: {
    reportsRef: 'firebase.firestore().collection("reports")',
  },
  getters: getter,
  actions: actions,
};

export default store;
