<template>
  <div>
    <!-- <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay> -->
    <v-app v-if="$route.meta.requiresAuth" app>
      <notifications
        group="mainActionsNotifications"
        position="top center"
        :duration="2000"
        width="40%"
        classes="my-notification"
      />
      <side-navbar class="mb-16"></side-navbar>
      <v-container>
        <router-view class="mt-5"></router-view>
      </v-container>
      <!-- <the-footer></the-footer> -->
    </v-app>
    <v-app v-else>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
import SideNavbar from "./components/UI/SideNavbar.vue";

// import TheFooter from "./components/UI/TheFooter.vue";
export default {
  components: {
    SideNavbar,
    // TheFooter,
  },
  data() {
    return {
      // overlay: this.$store.getters.showLoader,
    };
  },
};
</script>

<style >
html {
  overflow-y: auto;
}
html,
body,
.v-application,
.v-application--wrap {
  min-height: -webkit-fill-available;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.my-notification {
  padding: 10px;
  font-size: 15px;
  color: white;
  box-shadow: 1px 3px 0.5rem rgba(95, 86, 86, 0.5);
  margin: 9px;
}
.notification-title {
  font-size: 20px;
}
</style>
