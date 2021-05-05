import getter from "./getters.js";
import actions from "./actions.js";

const store = {
  state: {
    teamSectionsRef: 'firebase.firestore().collection("teamSections")',
  },
  getters: getter,
  actions: actions,
};

export default store;
