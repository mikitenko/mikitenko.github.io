import axios from "axios";

const BASEURL = process.env.VUE_APP_BASE_API_URL;
const agent = navigator.userAgent.toLowerCase();
const isScandiSafari = /safari/i.test(agent);

let token = ("; " + document.cookie)
  .split("; auth_token=")
  .pop()
  .split(";")
  .shift();

let atToken = ("; " + document.cookie)
  .split("; a-t=")
  .pop()
  .split(";")
  .shift();

if (isScandiSafari && !token && !atToken) {
  const urlParams = new URLSearchParams(window.location.search);
  atToken = urlParams.get("token");
}

let headers = {
  common: {
    locale: navigator.language || navigator.userLanguage,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    "Content-Type": "application/json"
  }
};

if (token) {
  headers.common["Authorization"] = `Bearer ${token}`;
} else if (atToken) {
  headers.common["Authorization"] = `Bearer ${atToken}`;
}

const globalAxiosInstance = axios.create({
  baseURL: BASEURL,
  headers: headers
});

export default globalAxiosInstance;
