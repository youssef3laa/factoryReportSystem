import axios from "../../../utils/axios";
const { urlPort } = require("../../../utils/variables");

export default {
  async addSparePart(store, payload) {
    return axios.post(`${urlPort}/sparePart/create`, payload);
  },
  async editSparePart(store, payload) {
    return axios.post(`${urlPort}/sparePart/update`, payload);
  },
  async deleteSparePart(store, payload) {
    return axios.post(`${urlPort}/sparePart/delete`, payload);
  },
  async getAllSpareParts() {
    return await axios.get(`${urlPort}/sparePart/`);
  },
  async getSparePartsLikeName(store, payload) {
    return await axios.get(`${urlPort}/sparePart/sparePartsLikeName`, {
      params: payload,
    });
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
  async getSparePartByExactName(store, payload) {
    return await axios.get(`${urlPort}/sparePart/exactName`, {
      params: payload,
    });
  },
  async getSparePartByEquipmentId(store, payload) {
    return await axios.get(`${urlPort}/sparePart/equipmentId`, {
      params: payload,
    });
  },
  async getFilteredSpareParts(store, payload) {
    console.log(payload);
    return await axios.get(`${urlPort}/sparePart/filter`, {
      params: payload,
    });
  },
};
