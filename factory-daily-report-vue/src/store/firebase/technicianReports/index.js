import getter from "./getters.js";
import actions from "./actions.js";
import mutations from "./mutations.js";

const store = {
  state: {
    pendingReportsCounter: 0,
    item: { partsDetails: [{}] },
    dialog: false,
    mode: null,
  },
  getters: getter,
  mutations: mutations,
  actions: actions,
};

export default store;
