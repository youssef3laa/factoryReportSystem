import Vue from "vue";
import VueRouter from "vue-router";
import Reports from "../components/reports/DataTable.vue";
import Fields from "../components/fields/FieldsTable.vue";
import Machines from "../components/machines/MachinesTable.vue";
import Parts from "../components/parts/PartsTable.vue";
import SparePartConsumption from "../components/SparePartConsumption/SparePartConsumptionTable.vue";
import Suppliers from "../components/parts/suppliers/SuppliersTable.vue";
import Teams from "../components/teams/TeamsTable.vue";
import TeamRoles from "../components/teams/teamRoles/TeamRoles.vue";
import TeamSections from "../components/teams/teamSections/TeamSections.vue";
import Logs from "../components/logs/LogsTable.vue";
import NotFound from "../views/NotFound.vue";
import Login from "../views/LoginView.vue";
import ReportCodes from "../components/reports/ReportCodes.vue";
import TechnicianReports from "../components/reports/TechnicianReports/TechnicianReports.vue";
import store from "../store/index";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/reports",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/reports",
    name: "Reports",
    component: Reports,
    meta: { requiresAuth: true },
  },
  {
    path: "/reports/fetch/:id",
    name: "ReportId",
    component: Reports,
    meta: { requiresAuth: true },
  },
  {
    path: "/reports/pending-reports",
    name: "TechnicianReports",
    component: TechnicianReports,
    meta: { requiresAuth: true },
  },
  {
    path: "/reports/pending-reports/:id",
    name: "TechReportId",
    component: TechnicianReports,
    meta: { requiresAuth: true },
  },
  {
    path: "/reports/report-codes",
    name: "ReportCodes",
    component: ReportCodes,
    meta: { requiresAuth: true },
  },
  {
    path: "/fields",
    name: "Fields",
    component: Fields,
    meta: { requiresAuth: true },
  },
  {
    path: "/fields/:id",
    name: "FieldsId",
    component: Fields,
    meta: { requiresAuth: true },
  },
  {
    path: "/equipments",
    name: "Machines",
    component: Machines,
    meta: { requiresAuth: true },
  },
  {
    path: "/equipments/:id",
    name: "MachinesId",
    component: Machines,
    meta: { requiresAuth: true },
  },
  {
    path: "/spare-parts",
    name: "Parts",
    component: Parts,
    meta: { requiresAuth: true },
  },
  {
    path: "/spare-parts/fetch/:id",
    name: "PartsId",
    component: Parts,
    meta: { requiresAuth: true },
  },
  {
    path: "/spare-parts/suppliers",
    name: "Suppliers",
    component: Suppliers,
    meta: { requiresAuth: true },
  },
  {
    path: "/spare-parts/suppliers/:id",
    name: "SuppliersId",
    component: Suppliers,
    meta: { requiresAuth: true },
  },
  {
    path: "/spare-part-consumptions",
    name: "SparePartConsumption",
    component: SparePartConsumption,
    meta: { requiresAuth: true },
  },
  {
    path: "/teams",
    name: "Teams",
    component: Teams,
    meta: { requiresAuth: true },
  },
  {
    path: "/teams/fetch/:id",
    name: "TeamsId",
    component: Teams,
    meta: { requiresAuth: true },
  },
  {
    path: "/teams/sections",
    name: "TeamSections",
    component: TeamSections,
    meta: { requiresAuth: true },
  },
  {
    path: "/teams/sections/:id",
    name: "TeamSectionsId",
    component: TeamSections,
    meta: { requiresAuth: true },
  },
  {
    path: "/teams/roles",
    name: "TeamRoles",
    component: TeamRoles,
    meta: { requiresAuth: true },
  },
  {
    path: "/teams/roles/:id",
    name: "TeamRolesId",
    component: TeamRoles,
    meta: { requiresAuth: true },
  },
  {
    path: "/logs",
    name: "Logs",
    component: Logs,
    meta: { requiresAuth: true },
  },
  {
    path: "/:notFound(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  let user;
  let token = Vue.$cookies.get("SYS_SEC_1D");
  if (token) {
    user = await store.dispatch("getUserDetailsById", token);
    if (user.message) {
      Vue.$cookies.remove("SYS_SEC_1D");
      next({ name: "Login" });
    }
    store.commit("authenticate", user);
  }
  if (to.meta.requiresAuth) {
    if (user) {
      next();
    } else {
      next({ name: "Login" });
    }
  } else if (to.name == "Login" && user) {
    next({ name: from.name ? from.name : "Home" });
  } else next();
});

export default router;
