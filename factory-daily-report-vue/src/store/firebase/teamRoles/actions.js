import axios from "../../../utils/axios";
const { urlPort } = require("../../../utils/variables");
export default {
  async addTeamRole(store, payload) {
    return axios.post(`${urlPort}/teamRoles/create`, payload);
  },
  async editTeamRole(store, payload) {
    return axios.post(`${urlPort}/teamRoles/update`, payload);
  },
  async getAllTeamRoles() {
    return await axios.get(`${urlPort}/teamRoles/`);
  },
  async getTeamRoleById(store, payload) {
    return await axios.get(`${urlPort}/teamRoles/id`, {
      params: payload,
    });
  },
  async getTeamRoleByName(store, payload) {
    return await axios.get(`${urlPort}/teamRoles/name`, {
      params: payload,
    });
  },
};
