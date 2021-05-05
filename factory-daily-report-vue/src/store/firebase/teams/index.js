import getter from "./getters.js";
import actions from "./actions.js";

const store = {
  state: {
    teamsRef: 'firebase.firestore().collection("teams")',
  },
  getters: getter,
  actions: actions,
};

export default store;
