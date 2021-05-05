import axios from "../../../utils/axios";
const { urlPort } = require("../../../utils/variables");

export default {
  async addTechnicianReport(store, payload) {
    return axios.post(`${urlPort}/technician-reports/create`, payload);
  },
  async approveTechnicianReport(store, payload) {
    return axios.post(`${urlPort}/technician-reports/approve`, payload);
  },
  async rejectTechnicianReport(store, payload) {
    return axios.post(`${urlPort}/technician-reports/reject`, payload);
  },
  async getAllTechnicianReports() {
    return await axios.get(`${urlPort}/technician-reports/`);
  },
  async getTechReportsCount(store) {
    let resp = await axios.get(`${urlPort}/technician-reports/count`);
    store.commit("setPendingReportsCounter", resp.data);
    return resp.data;
  },
  async getTechnicianReportById(store, payload) {
    return await axios.get(`${urlPort}/technician-reports/id`, {
      params: payload,
    });
  },
  async getFilteredTechnicianReports(store, payload) {
    return await axios.get(`${urlPort}/technician-reports/filter`, {
      params: payload,
    });
  },
};
