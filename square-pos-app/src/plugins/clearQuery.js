export default {
  install(Vue) {
    Vue.prototype.$removeURLParameter = obj => {
      let url = window.location.search;
      for (let key in obj) {
        let urlparts = url.split("?");
        if (urlparts.length >= 2) {
          let prefix = encodeURIComponent(key) + "=";
          let pars = urlparts[1].split(/[&;]/g);
          for (let i = pars.length; i-- > 0; ) {
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
              pars.splice(i, 1);
            }
          }
          url = urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
          url = url || "?";
        }
      }
      window.history.pushState("", "", url);
    };
  }
};
