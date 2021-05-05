import axios from "../../../utils/axios";
const { urlPort } = require("../../../utils/variables");

export default {
  async addSupplier(store, payload) {
    return axios.post(`${urlPort}/suppliers/create`, payload);
  },
  async editSupplier(store, payload) {
    return axios.post(`${urlPort}/suppliers/update`, payload);
  },
  async getAllSuppliers() {
    return await axios.get(`${urlPort}/suppliers/`);
  },
  async getSupplierById(store, payload) {
    return await axios.get(`${urlPort}/suppliers/id`, {
      params: payload,
    });
  },
  async getFilteredSuppliers(store, payload) {
    return await axios.get(`${urlPort}/suppliers/filter`, {
      params: payload,
    });
  },
  async getSupplierByName(store, payload) {
    return await axios.get(`${urlPort}/suppliers/name`, {
      params: payload,
    });
  },
};
