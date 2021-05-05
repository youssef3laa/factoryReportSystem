import axios from "../../../utils/axios";
const { urlPort } = require("../../../utils/variables");

export default {
  async getAllLogs() {
    return await axios.get(`${urlPort}/logs/`);
  },
};
