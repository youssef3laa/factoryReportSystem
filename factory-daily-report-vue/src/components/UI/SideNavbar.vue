<template>
  <v-app fluid>
    <v-navigation-drawer
      app
      v-model="drawer"
      class="pt-1"
      color="grey lighten-3"
      temporary
    >
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="../../assets/output-onlinepngtools.png"></v-img>
        </v-list-item-avatar>
      </v-list-item>
      <v-list nav dense>
        <v-list-item
          v-for="item in options"
          v-if="!item.options"
          :key="item.name"
          link
          :to="item.link"
          @click="item.modal ? showTechReportsModal() : {}"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          v-for="item in options"
          v-if="item.options"
          :key="item.name"
          :prepend-icon="item.icon"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item.options"
            :key="child.name"
            link
            exact
            :to="child.link"
          >
            <v-list-item-content>
              <v-list-item-title v-text="child.name"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar>
              <notification-bell
                v-if="child.notification"
                :size="20"
                :count="pendingReportsCounter"
                counterLocation="upperRight"
                counterStyle="roundRectangle"
                counterBackgroundColor="#FF0000"
                counterTextColor="#FFFFFF"
                iconColor="#a2a0a0"
              />
            </v-list-item-avatar>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app fixed>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-img
        max-height="200"
        max-width="200"
        src="../../assets/logo@2x.png"
      ></v-img>
      <!-- <v-toolbar-title>{{ factoryName }}</v-toolbar-title> -->
      <v-spacer></v-spacer>
      <div>
        {{ currentUser.name ? `Welcome, ${currentUser.name}` : "" }}
      </div>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>fa-angle-down </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item link v-for="(item, i) in rightSideMenuOptions" :key="i">
            <v-list-item-title @click="item.method">{{
              item.title
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <technician-add-report ref="techModal"></technician-add-report>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import TechnicianAddReport from "../reports/TechnicianReports/TechnicianAddReport.vue";
import NotificationBell from "vue-notification-bell";
export default {
  components: {
    TechnicianAddReport,
    NotificationBell,
  },

  data: () => ({
    drawer: false,
    factoryName: "Taghleef Industries Report System",
    rightSideMenuOptions: [],
    options: [
      {
        icon: "mdi-file-chart",
        name: "التقارير",
        modal: true,
      },
      {
        icon: "mdi-file-chart",
        name: "Report Details",
        options: [
          { name: "Reports", link: { name: "Reports" } },
          { name: "Report Codes", link: { name: "ReportCodes" } },
          {
            name: "Pending Reports",
            link: { name: "TechnicianReports" },
            notification: { counter: 0 },
          },
        ],
      },
      { icon: "mdi-location-exit", name: "Fields", link: { name: "Fields" } },
      {
        icon: "mdi-slot-machine-outline",
        name: "Equipments",
        link: { name: "Machines" },
      },
      { icon: "mdi-beaker", name: "Logs", link: { name: "Logs" } },
      {
        icon: "mdi-state-machine",
        name: "Spare Parts Consumption",
        link: { name: "SparePartConsumption" },
      },
      {
        icon: "mdi-engine",
        name: "Spare Parts Details",
        options: [
          { name: "Spare Parts", link: { name: "Parts" } },
          { name: "Suppliers", link: { name: "Suppliers" } },
        ],
      },
      {
        icon: "mdi-human-male-male",
        name: "Teams Details",
        options: [
          { name: "Teams", link: { name: "Teams" } },
          { name: "Sections", link: { name: "TeamSections" } },
          { name: "Roles", link: { name: "TeamRoles" } },
        ],
      },
    ],
  }),

  computed: {
    ...mapGetters(["pendingReportsCounter"]),
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
  },
  async created() {
    this.$store.dispatch("getTechReportsCount");
    this.fillRightSideOptions();
  },
  methods: {
    showTechReportsModal() {
      this.drawer = false;
      this.$refs.techModal.addModalMode();
    },
    logout() {
      this.$store.dispatch("signOutUser");
      this.$router.replace({ name: "Login" });
    },
    changePasswordRoute() {
      this.$router.replace({ name: "ChangePassword" });
    },
    fillRightSideOptions() {
      this.rightSideMenuOptions = [
        { title: "Change Password", method: this.changePasswordRoute },
        { title: "Logout", method: this.logout },
      ];
    },
  },
};
</script>
