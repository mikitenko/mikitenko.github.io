<template>
  <div class="vars">
    <div class="vars_header">
      <div class="vars_header__title roboto-medium">Choose option</div>
      <div class="vars_header__note">Select 1</div>
    </div>
    <div class="vars_body">
      <div
        v-for="option in variations"
        :key="option.id"
        class="vars_body__item"
        @click="selectOption(option)"
      >
        <div class="radio_button">
          <div
            class="radio_button__blank"
            v-if="option.id !== selectedVariationId"
          ></div>
          <div
            class="radio_button__selected"
            v-if="option.id === selectedVariationId"
          >
            <div class="radio_button_checker"></div>
          </div>
          <span class="radio_button__label">
            {{ option.item_variation_data.name }}
          </span>
        </div>
        <div class="vars_body__item_price">
          {{
            $getCurrency(option.item_variation_data.price_money.currency).label
          }}{{ itemPrice(option) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuItemVariations",
  props: {
    variations: {
      required: true,
      type: Array
    }
  },
  computed: {
    selectedVariationId() {
      return this.$store.state.selectedViewedItemVariation.id;
    }
  },
  methods: {
    /**
     * Format item price from cents to dollars
     * @item item which price is being calculated
     */
    itemPrice(item) {
      return (
        item["item_variation_data"]["price_money"]["amount"] / 100
      ).toFixed(2);
    },
    /**
     * Select item variation
     * @param variation - selected variation
     */
    selectOption(variation) {
      this.$store.commit("setSelectedViewedItemVariation", variation);
    },
    /**
     * Preselect the first item variation.
     */
    selectFirstItemVariation() {
      this.$store.commit("setSelectedViewedItemVariation", this.variations[0]);
    }
  },
  created() {
    // initially set first item variation as selected
    this.selectFirstItemVariation();
  }
};
</script>

<style lang="scss" scoped>
.vars {
  background-color: #ffffff;
  padding: 20px 0 0 0;
  margin-bottom: 12px;

  &_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 0 20px;
    &__title {
      text-transform: uppercase;
      color: #9b9b9b;
      font-size: 15px;
    }
    &__note {
      color: #f5a623;
      font-size: 15px;
    }
  }
  &_body__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;

    &_price {
      color: #7ed321;
    }
    .radio_button {
      display: flex;
      align-items: center;
      &__blank {
        height: 24px;
        width: 24px;
        background-color: #fafafa;
        border-radius: 50%;
        border: 1px solid #979797;
      }
      &__selected {
        height: 24px;
        width: 24px;
        border-radius: 50%;
        background-color: #1fb6ff;
        border: 1px solid #1fb6ff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &_checker {
        border-radius: 50%;
        height: 12px;
        width: 12px;
        background-color: #fafafa;
      }
      &__label {
        margin-left: 20px;
        font-size: 15px;
        color: #4a4a4a;
      }
    }
  }
  &_body__item:not(:last-child) {
    border-bottom: 1px solid #e4e4e4;
  }
}
</style>
