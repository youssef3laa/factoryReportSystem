import axios from "../../../utils/axios";
const { urlPort } = require("../../../utils/variables");
export default {
  async addTeamSection(store, payload) {
    return axios.post(`${urlPort}/teamSections/create`, payload);
  },
  async editTeamSection(store, payload) {
    return axios.post(`${urlPort}/teamSections/update`, payload);
  },
  async getAllTeamSections() {
    return await axios.get(`${urlPort}/teamSections/`);
  },
  async getTeamSectionByName(store, payload) {
    return await axios.get(`${urlPort}/teamSections/name`, {
      params: payload,
    });
  },
  async getTeamSectionById(store, payload) {
    return await axios.get(`${urlPort}/teamSections/id`, {
      params: payload,
    });
  },
};
