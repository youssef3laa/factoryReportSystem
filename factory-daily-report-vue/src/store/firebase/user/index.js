import getter from "./getters.js";
import axios from "../../../utils/axios";
import Vue from "vue";
import VueCookies from "vue-cookies";
const { urlPort } = require("../../../utils/variables");
Vue.use(VueCookies);
const store = {
  state: {
    user: null,
  },
  getters: getter,
  actions: {
    async login({ commit }, payload) {
      const user = (await axios.post(`${urlPort}/user/login`, payload)).data;
      if (user.message) return false;
      else {
        commit("authenticate", user);
        return user;
      }
    },
    async getUserDetailsById({ commit }, _id) {
      return (await axios.get(`${urlPort}/user/id`, { params: { _id } })).data;
    },
    signOutUser({ commit }, payload) {
      Vue.$cookies.remove("SYS_SEC_1D");
      commit("signOutUser");
    },
  },
  mutations: {
    authenticate(state, user) {
      state.user = user;
    },
    signOutUser(state, router) {
      state.user = null;
    },
  },
};

export default store;
