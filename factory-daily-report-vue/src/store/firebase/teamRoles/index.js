import getter from "./getters.js";
import actions from "./actions.js";

const store = {
  state: {
    teamRolesRef: 'firebase.firestore().collection("teamRoles")',
  },
  getters: getter,
  actions: actions,
};

export default store;
