<template>
  <div class="itm">
    <div class="itm-wrapper">
      <div class="itm-header blank">
        <div class="close-icon-box" @click="closeItemDetails()">
          <div class="close"></div>
        </div>
      </div>
      <div class="itm-body">
        <div v-if="item.image" class="itm-body_image">
          <img :src="item.image" alt="" />
        </div>
        <div class="itm-body_upper">
          <div class="itm-body_name-price">
            <div class="itm-body_name roboto-bold">
              {{ item.name }}
            </div>
            <!-- If item has only one variation -->
            <template v-if="isSingleOption">
              <div class="itm-body_price roboto-medium">
                {{ itemCurrency(item) }}{{ itemPrice(item) }}
              </div>
            </template>
          </div>
          <div class="itm-body_desc" v-if="item.description">
            {{ item.description }}
          </div>
        </div>
        <!-- If item has more than one variation -->
        <template v-if="!isSingleOption">
          <menu-item-variations :variations="item.variations" />
        </template>
        <!-- If item has modifiers -->
        <template v-if="!modifiersLoading">
          <template v-for="modifier in modifiers">
            <div :key="modifier.id">
              <menu-item-modifiers-single
                v-if="isSingleSelectionModifier(modifier)"
                :modifier="modifier"
              />
              <menu-item-modifiers-multiple
                v-else-if="isMultipleSelectionModifier(modifier)"
                :modifier="modifier"
              />
            </div>
          </template>
        </template>
        <div class="modifiers-loader-box" v-else>
          <request-loader />
        </div>
        <!-- Special instructions -->
        <div v-if="!modifiersLoading" class="itm-body_instructions">
          <menu-item-special-instructions />
          <div v-if="itemFromCart" class="remove-btn__wrapper">
            <div @click="removeItem" class="remove-btn">
              Remove From Order
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Item buttons Add To Cart and quantity counter -->
    <div class="itm-add">
      <!--      <div class="itm-add_errors" v-if="modifiersErrors.length">-->
      <!--        <div-->
      <!--          v-for="error in modifiersErrors"-->
      <!--          :key="error.id"-->
      <!--          class="itm-add_error"-->
      <!--        >-->
      <!--          Select at least-->
      <!--          <span class="itm-add_error__num">{{-->
      <!--            error.min_selected_modifiers-->
      <!--          }}</span>-->
      <!--          option for <span class="itm-add_error__name">{{ error.name }}</span>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="itm-add_buttons">
        <template v-if="!modifiersLoading">
          <menu-item-quantity-counter />
          <menu-item-add-to-cart
            :item-from-cart="itemFromCart"
            @close="closeItemDetails()"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import MenuItemVariations from "./MenuItemVariations";
import MenuItemSpecialInstructions from "./MenuItemSpecialInstructions";
import MenuItemQuantityCounter from "./MenuItemQuantityCounter";
import MenuItemAddToCart from "./MenuItemAddToCart";
import MenuItemModifiersSingle from "./MenuItemModifiersSingle";
import MenuItemModifiersMultiple from "./MenuItemModifiersMultiple";
import SquareApi from "@/api/square";
import RequestLoader from "../Global/RequestLoader";

export default {
  name: "MenuItem",
  components: {
    RequestLoader,
    MenuItemModifiersMultiple,
    MenuItemModifiersSingle,
    MenuItemAddToCart,
    MenuItemQuantityCounter,
    MenuItemSpecialInstructions,
    MenuItemVariations
  },
  props: {
    item: {
      required: true,
      type: Object
    },
    itemFromCart: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modifiers: [],
      modifiersLoading: false
    };
  },
  created() {
    // initially set first item variation as selected (if the item has 1 variation)
    this.selectFirstItemVariation();

    // get all the modifiers for the item
    this.getItemModifiers();

    // save item in the store
    this.$store.commit("setViewedItem", this.item);
  },
  computed: {
    isSingleOption() {
      if (this.itemFromCart) {
        return true;
      }
      return this.item.variations.length === 1;
    },
    modifiersErrors() {
      return this.$store.state.viewedItemModifiersWithErrors;
    }
  },
  methods: {
    /**
     * Format item price from cents to dollars
     * @item item which price is being calculated
     */
    itemPrice(item) {
      if (this.itemFromCart) {
        return (
          item.variation.item_variation_data.price_money.amount / 100
        ).toFixed(2);
      } else {
        return (
          item.variations[0]["item_variation_data"]["price_money"]["amount"] /
          100
        ).toFixed(2);
      }
    },
    itemCurrency(item) {
      if (this.itemFromCart) {
        return this.$getCurrency(item.currency).label;
      } else {
        return this.$getCurrency(
          item.variations[0]["item_variation_data"]["price_money"]["currency"]
        ).label;
      }
    },
    async removeItem() {
      const response = await this.$store.dispatch("removeFromCart");
      if (response) {
        await this.$store.dispatch("getItemsInCart").then(() => {
          if (!this.$store.state.itemsInCart.length) {
            this.$router.push({ name: "home" });
          }
          this.closeItemDetails();
        });
      }
    },
    /**
     * Reset store and emit 'close' to toggle the item details
     */
    closeItemDetails() {
      // reset store properties
      this.$store.commit("setViewedItem", {});
      this.$store.commit("setViewedItemSelectedQuantity", 1);
      this.$store.commit("setSelectedViewedItemVariation", {});
      this.$store.commit("resetViewedItemSelectedModifiers", []);
      this.$store.commit("resetViewedItemMinimumRestrictedModifiers", []);
      this.$store.commit("resetViewedItemModifiersWithErrors", []);
      this.$emit("close");
    },
    /**
     * Check if modifier selection type
     * @modifier Object modifier which type is to be inspected
     * @returns {boolean} true if the modifier selection type is "single"
     */
    isSingleSelectionModifier(modifier) {
      return modifier.selection_type.toLowerCase() === "single";
    },
    /**
     * Check if modifier selection type
     * @modifier Object modifier which type is to be inspected
     * @returns {boolean} true if the modifier selection type is "single"
     */
    isMultipleSelectionModifier(modifier) {
      return modifier.selection_type.toLowerCase() === "multiple";
    },
    /**
     * Preselect the first item variation if the item has only 1 variation.
     * In case item has several variation the initial select and all the operations with variations are being
     * made in the `MenuItemVariations` component
     */
    selectFirstItemVariation() {
      if (this.isSingleOption && !this.itemFromCart) {
        this.$store.commit(
          "setSelectedViewedItemVariation",
          this.item.variations[0]
        );
      } else {
        this.$store.commit(
          "setSelectedViewedItemVariation",
          this.item.variation
        );
      }
    },
    /**
     * Get all the modifiers for the item
     * @returns {Promise<void>}
     */
    async getItemModifiers() {
      this.modifiersLoading = true;
      let response = await SquareApi.getItemModifiers({
        appId: this.$store.state.appId,
        itemId: this.item.id
      });
      if (response) {
        this.modifiersLoading = false;
      }
      if (response.status === 200) {
        this.modifiers = response.data;
        // if modifier of a type SINGLE but has min restrictions that are not 1 change it's type to MULTIPLE
        this.modifiers = this.modifiers.map(mod => {
          if (
            mod.selection_type.toLowerCase() === "single" &&
            mod.min_selected_modifiers
          ) {
            if (mod.min_selected_modifiers !== 1) {
              mod.selection_type = "MULTIPLE";
            }
            return mod;
          } else {
            return mod;
          }
        });
        // check if any received modifier has a minimum required amount of options to be selected
        let minReqMultiple = this.modifiers.filter(mod => {
          if (mod.min_selected_modifiers) {
            return {
              id: mod.id,
              min_selected_modifiers: mod.id,
              name: mod.name
            };
          }
        });
        this.$store.commit(
          "setViewedItemMinimumRestrictedModifiers",
          minReqMultiple
        );
      }
    }
  },
  mounted() {
    if (this.itemFromCart) {
      this.item.modifiers.forEach(el => {
        this.$store.commit("setViewedItemSelectedModifiers", el);
      });
      this.$store.commit("setViewedItemSelectedQuantity", this.item.quantity);
    }
  }
};
</script>

<style lang="scss" scoped>
.modifiers-loader-box {
  position: relative;
  display: flex;
  height: 140px;
  background: #ffffff;
  align-items: center;
}

.itm {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  &-wrapper {
    margin-top: 18px;
    height: calc(100% - 18px);
  }
  &-header {
    height: 40px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    background: #ffffff;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    .close-icon-box {
      cursor: pointer;
      .close {
        position: absolute;
        left: 8px;
        top: 25px;
        width: 27px;
        height: 27px;
        opacity: 0.8;
        background: #fafafa;
        border-radius: 50%;
      }
      .close:hover {
        opacity: 1;
      }
      .close:before,
      .close:after {
        position: absolute;
        left: 12px;
        top: 1px;
        content: " ";
        height: 25px;
        width: 3px;
        background-color: #43494d;
      }
      .close:before {
        transform: rotate(45deg);
      }
      .close:after {
        transform: rotate(-45deg);
      }
    }
    &_image {
      height: 145px;
      max-height: 145px;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
    }
  }
  &-body {
    background-color: #eff0f2;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
    height: calc(100% - 125px);

    &_image {
      height: 180px;
      text-align: center;
      img {
        display: inline-block;
        height: 100%;
      }
    }

    &_upper {
      background-color: #ffffff;
      padding: 20px 15px 0 15px;
      margin-bottom: 12px;
    }

    &_name-price {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    &_name {
      font-size: 20px;
      color: #43494d;
    }

    &_price {
      font-size: 20px;
      color: #7ed321;
      min-width: 100px;
      text-align: right;
    }

    &_desc {
      color: #9b9b9b;
      font-size: 14px;
      padding-bottom: 15px;
    }

    &_instructions {
      flex-direction: column;
      background-color: #ffffff;
      min-height: 280px;
    }
  }
  &-add {
    width: 100%;
    position: fixed;
    bottom: 0;
    padding: 15px 10px;
    background-color: #ffffff;
    &_buttons {
      height: 55px;
      display: flex;
      justify-content: space-between;
    }
    &_error {
      font-size: 12px;
      &__num {
        color: #f65956;
        font-family: "Roboto-Bold", sans-serif;
      }
      &__name {
        color: #f65956;
        font-family: "Roboto-Bold", sans-serif;
        text-transform: uppercase;
      }
    }
    &_errors {
      margin-bottom: 8px;
    }
  }
}
.remove-btn__wrapper {
  position: relative;
  top: 15px;
  border-bottom: 1px solid rgb(193, 193, 193);
}
.remove-btn {
  cursor: pointer;
  margin: 0 auto;
  width: 200px;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  font-size: 16px;
  color: #f65956;
}
</style>
