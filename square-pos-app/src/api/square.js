import globalAxiosInstance from "./instance";

export default {
  checkConnection(appId) {
    return globalAxiosInstance
      .get(`w/apps/${appId}/square/status`)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  },
  getItems(appId) {
    return globalAxiosInstance
      .get(`w/apps/${appId}/square/items`)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  },
  getLocations(appId) {
    return globalAxiosInstance
      .get(`w/apps/${appId}/square/locations`)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  },
  getCurrentLocation(appId) {
    return globalAxiosInstance
      .get(`w/apps/${appId}/square/locations/default`)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  },
  setLocation(appId, locationId) {
    return globalAxiosInstance
      .put(`w/apps/${appId}/square/locations/${locationId}/default`)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  },
  getItemModifiers({ appId, itemId }) {
    return globalAxiosInstance
      .get(`w/apps/${appId}/square/items/${itemId}/modifiers`)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  },
  saveItemToCart({ appId, item }) {
    return globalAxiosInstance
      .post(`w/apps/${appId}/square/cart`, item)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  },
  removeFromCart({ appId, item }) {
    return globalAxiosInstance
      .delete(`w/apps/${appId}/square/cart`, { data: item })
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  },
  getItemsInCart(appId) {
    return globalAxiosInstance
      .get(`w/apps/${appId}/square/cart`)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  },
  processPayment({ appId, data }) {
    return globalAxiosInstance
      .post(`w/apps/${appId}/square/orders/payment`, data)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  },
  getOrderDetails(data) {
    return globalAxiosInstance
      .get(`w/apps/${data.appId}/square/orders/${data.orderId}`)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  }
};
