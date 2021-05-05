import axios from "../../../utils/axios";
const { urlPort } = require("../../../utils/variables");

export default {
  async addSparePart(store, payload) {
    return axios.post(`${urlPort}/sparePart/create`, payload);
  },
  async editSparePart(store, payload) {
    return axios.post(`${urlPort}/sparePart/update`, payload);
  },
  async getAllSpareParts() {
    return await axios.get(`${urlPort}/sparePart/`);
  },
  async getSparePartById(store, payload) {
    return await axios.get(`${urlPort}/sparePart/id`, {
      params: payload,
    });
  },
  async getSparePartByName(store, payload) {
    return await axios.get(`${urlPort}/sparePart/name`, {
      params: payload,
    });
  },
  async getSparePartByEquipmentId(store, payload) {
    return await axios.get(`${urlPort}/sparePart/equipmentId`, {
      params: payload,
    });
  },
  async getFilteredSparePart(store, payload) {
    return await axios.get(`${urlPort}/sparePart/filter`, {
      params: payload,
    });
  },
};
