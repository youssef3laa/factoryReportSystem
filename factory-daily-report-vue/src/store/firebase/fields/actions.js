import axios from "../../../utils/axios";
const { urlPort } = require("../../../utils/variables");

export default {
  async addField(store, payload) {
    return axios.post(`${urlPort}/fields/create`, payload);
  },
  async editField(store, payload) {
    return axios.post(`${urlPort}/fields/update`, payload);
  },
  async deleteField(store, payload) {
    return axios.post(`${urlPort}/fields/delete`, payload);
  },
  async getAllFields() {
    return await axios.get(`${urlPort}/fields/`);
  },
  async getFieldById(store, payload) {
    return await axios.get(`${urlPort}/fields/id`, {
      params: payload,
    });
  },
  async getFieldByName(store, payload) {
    return await axios.get(`${urlPort}/fields/name`, {
      params: payload,
    });
  },
  async getFilteredFields(store, payload) {
    return await axios.get(`${urlPort}/fields/filter`, {
      params: payload,
    });
  },
};
