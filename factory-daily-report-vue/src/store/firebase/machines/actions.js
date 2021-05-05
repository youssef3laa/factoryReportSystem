import axios from "../../../utils/axios";
const { urlPort } = require("../../../utils/variables");

export default {
  async addEquipment(store, payload) {
    return axios.post(`${urlPort}/equipments/create`, payload);
  },
  async editEquipment(store, payload) {
    return axios.post(`${urlPort}/equipments/update`, payload);
  },
  async getAllEquipments() {
    return await axios.get(`${urlPort}/equipments/`);
  },
  async getEquipmentById(store, payload) {
    return await axios.get(`${urlPort}/equipments/id`, {
      params: payload,
    });
  },
  async getEquipmentByFieldId(store, payload) {
    return await axios.get(`${urlPort}/equipments/fieldId`, {
      params: payload,
    });
  },
  async getEquipmentByName(store, payload) {
    return await axios.get(`${urlPort}/equipments/name`, {
      params: payload,
    });
  },
  async getFilteredEquipments(store, payload) {
    return await axios.get(`${urlPort}/equipments/filter`, {
      params: payload,
    });
  },
};
