<template>
  <div
    :class="{ active: activateButton, update: activateButton && itemFromCart }"
    class="add-btn"
    @click="addItemToCart()"
  >
    <div class="add-btn_text">
      <template v-if="!sendingItem">
        <div class="add-btn_text_left roboto-bold">{{ btnText }}</div>
        <div>${{ itemPrice }}</div>
      </template>
      <div v-else>Wait</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuItemAddToCart",
  props: {
    itemFromCart: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sendingItem: false
    };
  },
  computed: {
    btnText() {
      if (this.itemFromCart) {
        return "Update Order";
      } else {
        return "Add To Order";
      }
    },
    itemPrice() {
      return this.$store.getters.viewedItemPrice;
    },
    hasErrors() {
      return !!this.$store.state.viewedItemModifiersWithErrors.length;
    },
    activateButton() {
      if (this.$store.state.viewedItemMinimumRestrictedModifiers.length) {
        const modifiers = [];
        this.$store.state.viewedItemMinimumRestrictedModifiers.forEach(item => {
          // check if the amount of selected modifier options is sufficient
          let selectedModifierOptions = this.$store.state.viewedItemSelectedModifiers.filter(
            mod => mod.modifier_id === item.id
          );
          if (item.min_selected_modifiers > selectedModifierOptions.length) {
            modifiers.push(false);
          } else {
            modifiers.push(true);
          }
        });
        return modifiers.indexOf(false) === -1;
      } else {
        return true;
      }
    }
  },
  methods: {
    /**
     * Validate all modifiers restrictions and add item to cart
     */
    async addItemToCart() {
      // if the order has errors do not proceed
      if (this.hasErrors) {
        return false;
      }
      this.sendingItem = true;
      if (this.itemFromCart) {
        await this.$store.dispatch("removeFromCart");
      }
      await this.$store.dispatch("addItemToCart");
      let vm = this;
      await this.$store.dispatch("getItemsInCart").then(() => {
        vm.sendingItem = false;
        vm.$emit("close");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.add-btn {
  width: calc(100% - 145px);
  height: 55px;
  color: #ffffff;
  text-align: center;
  background: #a4a4ae;
  opacity: 0.5;
  pointer-events: none;
  font-size: 16px;
  border-radius: 30px;
  box-shadow: 1px 2px 2px #b1b1b1;
  display: flex;
  align-items: center;
  justify-content: center;
  &_text {
    display: flex;
    padding: 0 10px;
    overflow: hidden;
    &_left {
      margin-right: 8px;
    }
  }
  &.active {
    background-color: #1fb6ff;
    opacity: 1;
    pointer-events: auto;
    cursor: pointer;
  }
  &.update {
    background-color: #7ed321;
  }
}
</style>
