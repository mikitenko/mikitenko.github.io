<template>
  <div>
    <div class="item" @click="toggleItemDetails(true)">
      <div class="item_preview">
        <div class="item_details" :class="{ short: item.image }">
          <div class="item_name roboto-medium" :class="{ short: item.image }">
            {{ item.name }}
          </div>
          <!-- TODO  ADD CLAMP.JS -->
          <p class="item_description roboto">{{ item.description }}</p>
          <div class="item_price roboto-bold">{{ itemPrice }}</div>
        </div>
        <div class="item_image__wrapper" v-if="item.image">
          <img :src="item.image" alt="Item Image" class="item_image" />
        </div>
      </div>
    </div>
    <transition name="menu-item-transition">
      <menu-item
        :item="item"
        @close="toggleItemDetails(false)"
        v-if="showItemDetails"
      ></menu-item>
    </transition>
  </div>
</template>

<script>
import MenuItem from "../../MenuItem/MenuItem";
export default {
  name: "HomeCategoryItem",
  components: {
    MenuItem
  },
  props: {
    item: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      showItemDetails: false
    };
  },
  computed: {
    /**
     * Compute the price of the item to be shown
     * @returns {string} The price to be rendered. Can be range of prices, individual price, or "Unknown"
     */
    itemPrice() {
      try {
        let currency = this.$getCurrency(
          this.item.variations[0]["item_variation_data"]["price_money"][
            "currency"
          ]
        ).label;
        if (this.item.variations.length > 1) {
          let prices = this.item.variations
            .map(variation =>
              (
                variation["item_variation_data"]["price_money"]["amount"] / 100
              ).toFixed(2)
            )
            .sort((a, b) =>
              parseFloat(a) > parseFloat(b)
                ? 1
                : parseFloat(a) === parseFloat(b)
                ? 0
                : -1
            );
          return `${currency}${prices[0]} - ${prices[prices.length - 1]}`;
        } else {
          let price = (
            this.item.variations[0]["item_variation_data"]["price_money"][
              "amount"
            ] / 100
          ).toFixed(2);
          return `${currency}${price}`;
        }
      } catch (e) {
        return null;
      }
    }
  },
  methods: {
    /**
     * Toggle item details
     * @param val true/false to open close Item details
     */
    toggleItemDetails(val) {
      this.showItemDetails = val;
      if (val) {
        this.$router.replace({ query: { item_id: this.item.id } });
      } else {
        this.$router.replace({ query: {} });
      }
    }
  },
  created() {
    const itemId = this.$route.query.item_id;
    if (itemId && itemId === this.item.id) {
      this.showItemDetails = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  padding: 15px;
  cursor: pointer;
  &_name {
    font-size: 18px;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #4a4a4a;
  }
  &_name.short {
    width: calc(100% - 80px);
  }
  &_preview {
    width: calc(100vw - 30px);
    display: flex;
  }
  &_details.short {
    width: calc(100% - 80px);
  }
  &_image__wrapper {
    width: 80px;
    height: 80px;
  }
  &_description {
    color: #9b9b9b;
    font-size: 14px;
    margin-bottom: 10px;
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  &_image {
    width: 80px;
    height: 80px;
    border-radius: 16px;
  }
  &_price {
    color: #7ed321;
    font-size: 16px;
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
</style>
