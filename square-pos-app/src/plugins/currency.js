export default {
  install(Vue) {
    Vue.prototype.$getCurrency = currency => {
      switch (currency) {
        case "USD":
          return {
            label: "$",
            value: currency
          };
        default:
          return {
            label: "",
            value: ""
          };
      }
    };
  }
};
