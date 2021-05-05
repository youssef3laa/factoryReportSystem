import Vuex from "vuex";
import Vue from "vue";
import userStore from "./firebase/user/index.js";
import supplierStore from "./firebase/suppliers/index.js";
import reportStore from "./firebase/reports/index.js";
import technicianReportStore from "./firebase/technicianReports/index";
import fieldStore from "./firebase/fields/index.js";
import machineStore from "./firebase/machines/index.js";
import partStore from "./firebase/parts/index.js";
import teamSectionStore from "./firebase/teamSections/index.js";
import teamRoleStore from "./firebase/teamRoles/index.js";
import teamStore from "./firebase/teams/index.js";
import logsStore from "./firebase/logs/index.js";

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    user: userStore,
    suppliers: supplierStore,
    reports: reportStore,
    fields: fieldStore,
    machines: machineStore,
    parts: partStore,
    teamSections: teamSectionStore,
    teamRoles: teamRoleStore,
    teams: teamStore,
    logs: logsStore,
    technicianReports: technicianReportStore,
  },
});

export default store;
