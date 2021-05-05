import axios from "../../../utils/axios";
const { urlPort } = require("../../../utils/variables");

export default {
  async addReport(store, payload) {
    return axios.post(`${urlPort}/reports/create`, payload);
  },
  async editReport(store, payload) {
    return axios.post(`${urlPort}/reports/update`, payload);
  },
  async getAllReports() {
    return await axios.get(`${urlPort}/reports/`);
  },
  async getReportById(store, payload) {
    return await axios.get(`${urlPort}/reports/id`, {
      params: payload,
    });
  },
  async getFilteredReports(store, payload) {
    return await axios.get(`${urlPort}/reports/filter`, {
      params: JSON.stringify(payload),
    });
  },
  async getReportsMoreThanOrEqualDate(store, payload) {
    return await axios.get(`${urlPort}/reports/dateMoreThan`, {
      params: payload,
    });
  },
  async getReportsLikeReportCode(store, payload) {
    return await axios.get(`${urlPort}/reports/reportsLikeCode`, {
      params: payload,
    });
  },
};
