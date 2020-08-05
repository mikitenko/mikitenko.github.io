import Vue from "vue";
import VueCookie from "vue-cookie";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueScrollTo from "vue-scrollto";
import Currency from "./plugins/currency";
import ClearQuery from "./plugins/clearQuery";
import { generateToken } from "./services/generateToken";

Vue.use(VueCookie);
Vue.use(VueScrollTo);
Vue.use(Currency);
Vue.use(ClearQuery);
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.$isHideHeader =
  window.location.href.indexOf("shwah=false") === -1;

generateToken(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
});
