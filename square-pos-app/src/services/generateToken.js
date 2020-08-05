import Vue from "vue";
import axios from "axios";
import globalAxiosInstance from "../api/instance";
export function generateToken(callback) {
  if (!Vue.cookie.get("a-t")) {
    axios.post(`${process.env.VUE_APP_CORE_API_URL}/tokens`).then(response => {
      let at = response.data.data.user.auth_token;
      let baseCookieDomain = location.hostname.replace("www", "");
      if (
        process.env.NODE_ENV === "production" ||
        process.env.NODE_ENV === "staging"
      ) {
        Vue.cookie.set("a-t", at, {
          expires: "6M",
          domain: baseCookieDomain,
          secure: true,
          SameSite: "None"
        });
      } else {
        Vue.cookie.set("a-t", at, {
          expires: "6M",
          domain: baseCookieDomain,
          SameSite: "Lax"
        });
      }
      globalAxiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${at}`;
      callback();
    });
  } else {
    callback();
  }
}
