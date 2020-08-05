<template>
  <div class="cart-items">
    <div v-for="item in itemsInCart" :key="item.sid" class="cart-item">
      <div class="cart-item_left">
        <div
          @click="openItem(item)"
          class="cart-item_left__quant roboto-medium"
        >
          {{ item.quantity }}
        </div>
        <div>
          <div class="cart-item_left__name roboto-medium">
            <span>
              {{ item.name }}
            </span>
            <ul v-if="item.modifiers.length" class="cart-item_modifiers-list">
              <li
                class="cart-item_modifier"
                v-for="mod in item.modifiers"
                :key="mod.id"
              >
                {{ mod.name }}
              </li>
            </ul>
          </div>
          <div class="cart-item_left__desc">
            {{ item.description }}
          </div>
        </div>
      </div>
      <div class="cart-item_price roboto-bold">
        {{ $getCurrency(item.currency).label }}{{ (+item.price).toFixed(2) }}
      </div>
    </div>
    <transition name="menu-item-transition">
      <menu-item
        :item="item"
        :item-from-cart="true"
        @close="showItemDetails = false"
        v-if="showItemDetails"
      ></menu-item>
    </transition>
  </div>
</template>

<script>
import MenuItem from "../MenuItem/MenuItem";
export default {
  name: "CartItemsList",
  components: {
    MenuItem
  },
  data() {
    return {
      item: {},
      showItemDetails: false
    };
  },
  computed: {
    itemsInCart() {
      return this.$store.state.itemsInCart;
    }
  },
  methods: {
    openItem(item) {
      this.item = item;
      this.showItemDetails = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.cart {
  &-items {
    width: 100%;
    padding: 0 15px;
  }
  &-item {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    &_left {
      display: flex;
      align-items: flex-start;
      &__quant {
        color: #1fb6ff;
        cursor: pointer;
        font-size: 16px;
        margin-right: 20px;
        min-width: 20px;
        display: inline-block;
      }
      &__name {
        font-size: 16px;
      }
      &__desc {
        margin-top: 8px;
        color: #9b9b9b;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    &_price {
      color: #7ed321;
      font-size: 16px;
      display: inline-block;
      min-width: 80px;
      text-align: right;
    }
    &_modifiers-list {
      margin-top: 6px;
      list-style: none;
      padding: 0;
    }
    &_modifier {
      text-transform: capitalize;
      color: #9b9b9b;
      line-height: 22px;
      font-weight: 400;
      font-size: 14px;
    }
  }
  @keyframes slideIn {
    from {
      top: 100px;
    }

    to {
      top: 0;
    }
  }

  @keyframes slideOut {
    from {
      top: 0;
      opacity: 1;
    }

    to {
      top: 100px;
      opacity: 0;
    }
  }

  .menu-item-transition-enter-active {
    animation-duration: 0.3s;
    animation-fill-mode: both;
    animation-name: slideIn;
  }

  .menu-item-transition-leave-active {
    animation-duration: 0.3s;
    animation-fill-mode: both;
    animation-name: slideOut;
  }
}
</style>
