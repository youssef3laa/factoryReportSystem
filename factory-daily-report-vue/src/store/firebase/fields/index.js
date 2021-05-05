import getter from "./getters.js";
import actions from "./actions.js";

const store = {
  state: {
    fieldsRef: "",
  },
  getters: getter,
  actions: actions,
};

export default store;
