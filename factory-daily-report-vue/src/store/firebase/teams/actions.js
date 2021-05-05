import axios from "../../../utils/axios";
const { urlPort } = require("../../../utils/variables");
export default {
  async addTeam(store, payload) {
    return axios.post(`${urlPort}/user/register`, payload);
  },
  async editTeam(store, payload) {
    return axios.post(`${urlPort}/user/update`, payload);
  },
  async getAllTeams() {
    return await axios.get(`${urlPort}/user/`);
  },
  async getFilteredTeams(store, payload) {
    return await axios.get(`${urlPort}/user/filter`, {
      params: payload,
    });
  },
  async getTeamByName(store, payload) {
    return await axios.get(`${urlPort}/user/name`, {
      params: payload,
    });
  },
  async getTeamByEmail(store, payload) {
    return await axios.get(`${urlPort}/user/email`, {
      params: payload,
    });
  },
  async getTeamById({ getters }, payload) {
    return await axios.get(`${urlPort}/user/id`, {
      params: payload,
    });
  },
};
