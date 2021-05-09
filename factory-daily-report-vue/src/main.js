import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router/index.js";
import VueCookies from "vue-cookies";
import Vuex from "vuex";
import store from "./store/index.js";
import Notifications from "vue-notification";
import AsyncComputed from "vue-async-computed";
Vue.config.productionTip = false;
Vue.use(VueCookies);
Vue.use(Notifications);
Vue.use(AsyncComputed);
let app;
if (!app) {
  app = new Vue({
    vuetify,
    Vuex,
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
}
