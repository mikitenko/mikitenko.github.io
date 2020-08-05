import Vue from "vue";
import Vuex from "vuex";
import SquareService from "@/api/square";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connectedToSquare: false,
    appId: "",
    loadingMenuItemsList: true,
    locations: [],
    currentLocation: false,
    items: [],
    categories: [],
    selectedCategoryId: null,
    viewedItem: {},
    selectedViewedItemVariation: {},
    viewedItemNote: "",
    viewedItemSelectedModifiers: [],
    viewedItemSelectedQuantity: 1,
    viewedItemMinimumRestrictedModifiers: [],
    viewedItemModifiersWithErrors: [],
    itemsInCart: [],
    itemsInCartTaxes: {},
    selectedTip: {},
    orderDetails: null,
    orderLocationOption: "dine in",
    isClickSelect: false,
    isHorizontalScroll: false
  },
  mutations: {
    setOrderLocationOption(state, value) {
      state.orderLocationOption = value;
    },
    setCurrentLocation(state, value) {
      state.currentLocation = value;
    },
    setLocations(state, value) {
      state.locations = value;
    },
    /**
     * Save chatpage id to store
     * @param state
     * @param value
     */
    setConnectedToSquare(state, value) {
      state.connectedToSquare = value;
    },
    /**
     * Save app id to store
     * @param state
     * @param appId
     */
    setAppId(state, appId) {
      state.appId = appId;
    },
    /**
     * Set the loading menuItemsList to true when the item is loading
     * @param state
     * @param loading {Boolean} indicates if the cats are being requested
     */
    toggleLoadingMenuItemsList(state, loading) {
      state.loadingMenuItemsList = loading;
    },
    /**
     * Get the menu items from api
     * @param state
     * @param items
     */
    setItems(state, items) {
      state.items = items;
    },
    /**
     * Get the categories from api
     * @param state
     * @param categories
     */
    setCategories(state, categories) {
      state.categories = categories;
    },
    /**
     * Set selected category Id
     * @param state
     * @param categoryId
     */
    setSelectedCategoryId(state, categoryId) {
      state.selectedCategoryId = categoryId;
    },
    /**
     * Set viewed item selected quantity
     * @param state
     * @param quantity
     */
    setViewedItemSelectedQuantity(state, quantity) {
      state.viewedItemSelectedQuantity = quantity;
    },
    /**
     * Save the modifiers with minimum requirements for viewed item
     * @param state
     * @param modifiers
     */
    setViewedItemMinimumRestrictedModifiers(state, modifiers) {
      state.viewedItemMinimumRestrictedModifiers = modifiers;
    },
    /**
     * Reset the modifiers with minimum requirements when the item page is closed
     * @param state
     */
    resetViewedItemMinimumRestrictedModifiers(state) {
      state.viewedItemMinimumRestrictedModifiers = [];
    },
    /**
     * If some modifier has insufficient number of modifier options add it to the list
     * @param state
     * @param modifier
     */
    setViewedItemModifiersWithErrors(state, modifier) {
      state.viewedItemModifiersWithErrors.push(modifier);
    },
    /**
     * Reset modifier with errors list
     * @param state
     */
    resetViewedItemModifiersWithErrors(state) {
      state.viewedItemModifiersWithErrors = [];
    },
    /**
     * Set selected item variation
     * @param state
     * @param variation
     */
    setSelectedViewedItemVariation(state, variation) {
      state.selectedViewedItemVariation = variation;
    },
    /**
     * Adds selected modifiers options for viewed item
     * @param state
     * @param option selected option
     * @returns {boolean} returns false to stop function execution
     */
    setViewedItemSelectedModifiers(state, option) {
      // If any modifier option selected reset errors
      state.viewedItemModifiersWithErrors = [];

      // EACH MODIFIER SHOULD HAVE AN ID
      // EACH MODIFIER HAS A TYPE: SINGLE or MULTIPLE
      // EACH MODIFIER HAS A LIST OF OPTIONS
      // EACH OPTION HAS AN ID

      let addedOptionsId = state.viewedItemSelectedModifiers.map(
        item => item.id
      );

      // check if the modifier option is already added and deselect it
      if (addedOptionsId.indexOf(option.id) >= 0) {
        state.viewedItemSelectedModifiers = state.viewedItemSelectedModifiers.filter(
          item => item.id !== option.id
        );
        return false;
      }

      // if modifier is SINGLE select type and the other modifier option been added change it to a new one
      let isSingleSelect = false;
      if (option.modifier_type) {
        isSingleSelect = option.modifier_type.toLowerCase() === "single";
      }
      if (isSingleSelect) {
        state.viewedItemSelectedModifiers = state.viewedItemSelectedModifiers.filter(
          item => item.modifier_id !== option.modifier_id
        );
        state.viewedItemSelectedModifiers.push(option);
        return false;
      }
      state.viewedItemSelectedModifiers.push(option);
    },
    /**
     * Reset modifiers for viewed item on item page close
     * @param state
     */
    resetViewedItemSelectedModifiers(state) {
      state.viewedItemSelectedModifiers = [];
    },
    /**
     * Set viewed item note
     * @param state
     * @param note
     */
    setViewedItemNote(state, note) {
      state.viewedItemNote = note;
    },
    /**
     * Set viewed item
     * @param state
     * @param item
     */
    setViewedItem(state, item) {
      let storedItem = Object.assign({}, item);
      if (storedItem.variations) {
        delete storedItem.variations;
      }
      state.viewedItem = storedItem;
    },
    /**
     * Set items in cart
     * @param state
     * @param items
     */
    setItemsInCart(state, items) {
      state.itemsInCart = items;
    },
    /**
     * Set selected tip
     * @param state
     * @param tip selected tip
     */
    setSelectedTip(state, tip) {
      state.selectedTip = tip;
    },
    /**
     * Set taxes for items in cart
     */
    setItemsInCartTaxes(state, taxes) {
      state.itemsInCartTaxes = taxes;
    },
    /**
     * Set order details
     * @param state
     * @param details
     */
    setOrderDetails(state, details) {
      state.orderDetails = details;
    },
    /**
     * When the menu category is being scrolled to by Vue-scrollto after user clicked on it
     * set this param to true not to duplicate the selection of category via onScroll watcher in the
     * HomeBody category (onItemsScroll)
     * When the scroll is over set this param to false again
     * @param state
     * @param click
     */
    setClickSelect(state, click) {
      state.isClickSelect = click;
    },
    /**
     * When the horizontal nav is being scrolled by Vue-scrollto set this to true
     * @param state
     * @param scroll
     */
    setHorizontalScroll(state, scroll) {
      state.isHorizontalScroll = scroll;
    }
  },
  getters: {
    /**
     * Update the price of the item
     */
    viewedItemPrice(state) {
      let variationPrice =
        state.selectedViewedItemVariation.item_variation_data.price_money
          .amount;
      // calculate modifiers price
      let modifiersPrice = 0;
      let modifiersPriceCents = state.viewedItemSelectedModifiers.reduce(
        (total, option) => total + option.price_money.amount,
        0
      );
      if (modifiersPriceCents) {
        modifiersPrice = modifiersPriceCents;
      }
      return (
        ((variationPrice + modifiersPrice) * state.viewedItemSelectedQuantity) /
        100
      ).toFixed(2);
    },
    nonEmptyItems(state, getters) {
      const categories = [...getters.nonEmptyCategories];
      return categories.map(cat => {
        const newItems = [...cat.items];
        cat.items.forEach(el => {
          const varLength = el.variations.filter(variation => {
            try {
              return (
                variation.item_variation_data.price_money.amount !== "" &&
                variation.item_variation_data.price_money.currency
              );
            } catch (e) {
              return false;
            }
          }).length;
          const index = newItems.findIndex(it => it.id === el.id);
          if (el.hide) {
            newItems.splice(index, 1);
          } else if (!el.hide && varLength === 0) {
            newItems.splice(index, 1);
          }
        });
        let id;
        if (cat.id) {
          id = cat.id;
        } else {
          if (cat.name.split(" ").length > 1) {
            id = cat.name.split(" ")[0];
          } else {
            id = cat.name;
          }
        }
        return {
          ...cat,
          id: id,
          items: newItems
        };
      });
    },
    nonEmptyCategories(state) {
      return state.items.filter(category => {
        return (
          !category.hide &&
          category.items.filter(el => {
            return (
              !el.hide &&
              el.variations.filter(variation => {
                try {
                  return (
                    variation.item_variation_data.price_money.amount !== "" &&
                    variation.item_variation_data.price_money.currency
                  );
                } catch (e) {
                  return false;
                }
              }).length
            );
          }).length
        );
      });
    }
  },
  actions: {
    async getCurrentLocation({ commit }, appId) {
      const response = await SquareService.getCurrentLocation(appId);
      if (response.status === 200 && response.data) {
        if (response.data && response.data.id) {
          commit("setCurrentLocation", response.data);
          return true;
        } else {
          commit("setCurrentLocation", false);
          return false;
        }
      }
    },
    async getLocations({ commit }, appId) {
      const response = await SquareService.getLocations(appId);
      if (response.status === 200 && response.data) {
        let locations = response.data.map(location => {
          location.showDays = false;
          return location;
        });
        commit("setLocations", locations);
      }
    },
    async checkConnection({ commit }, appId) {
      const response = await SquareService.checkConnection(appId);
      if (response.status === 200 && response.data) {
        commit("setConnectedToSquare", true);
        return true;
      } else {
        return false;
      }
    },
    /**
     * Get menu Items from api
     * @param commit
     * @param state
     * @returns {Promise<void>}
     */
    async getItems({ commit, state }) {
      const response = await SquareService.getItems(state.appId);
      if (response.status === 200 && response.data) {
        let categories = response.data.map(cat => {
          let item = {
            name: cat.name,
            hide: cat.hide
          };
          if (cat.id) {
            item.id = cat.id;
          } else {
            item.id = cat.name;
          }
          return item;
        });
        commit("setItems", response.data);
        commit("setCategories", categories);
        commit("toggleLoadingMenuItemsList", false);
      }
    },
    /**
     * Sent the req to api in order to add item to cart
     * @param state
     * @param getters
     * @returns {Promise<void>}
     */
    async addItemToCart({ state, getters }) {
      let itemToOrder = state.viewedItem;
      itemToOrder.quantity = state.viewedItemSelectedQuantity;
      itemToOrder.modifiers = state.viewedItemSelectedModifiers;
      itemToOrder.variation = state.selectedViewedItemVariation;
      itemToOrder.special_instruction = state.viewedItemNote;
      itemToOrder.price = getters.viewedItemPrice;
      itemToOrder.currency =
        state.selectedViewedItemVariation.item_variation_data.price_money.currency;

      const response = await SquareService.saveItemToCart({
        appId: state.appId,
        item: {
          item: itemToOrder
        }
      });
      if (response.status === 200 && response.data) {
        return response;
      }
    },
    async removeFromCart({ state }) {
      const response = await SquareService.removeFromCart({
        appId: state.appId,
        item: {
          item: state.viewedItem
        }
      });
      if (response.status === 200 && response.data) {
        return response;
      }
    },
    /**
     * Get items in cart
     * @param commit
     * @param state
     * @returns {Promise<void>}
     */
    async getItemsInCart({ commit, state }) {
      const response = await SquareService.getItemsInCart(state.appId);
      if (response.status === 200 && response.data) {
        commit("setItemsInCart", response.data.items);
        commit("setItemsInCartTaxes", response.data.totals);
      }
    }
  }
});
