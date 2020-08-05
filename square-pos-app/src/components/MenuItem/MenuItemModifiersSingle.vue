<template>
  <div class="vars">
    <br />
    <div class="vars_header">
      <div class="vars_header__title roboto-medium">
        {{ modifier.name }}
      </div>
      <div
        class="vars_header__note"
        :class="{ error: hasErrors }"
        v-if="modifier.min_selected_modifiers && !selectedOptionId"
      >
        Minimum options to select: {{ modifier.min_selected_modifiers }}
      </div>
    </div>
    <div class="vars_body">
      <div
        v-for="option in modifier.modifiers"
        :key="option.id"
        class="vars_body__item"
        @click="selectOption(option)"
      >
        <div class="radio_button">
          <div
            class="radio_button__blank"
            v-if="option.id !== selectedOptionId"
          ></div>
          <div
            class="radio_button__selected"
            v-if="option.id === selectedOptionId"
          >
            <div class="radio_button_checker"></div>
          </div>
          <span class="radio_button__label">
            {{ optionName(option.name) }}
          </span>
        </div>
        <template v-if="option.price_money">
          <div class="vars_body__item_price">
            {{ $getCurrency(option.price_money.currency).label
            }}{{ itemPrice(option) }}
          </div>
        </template>
        <span class="vars_body__item_price" v-else>Free</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuItemModifiersSingle",
  props: {
    modifier: {
      required: true,
      type: Object
    }
  },
  computed: {
    /**
     * Return the ID fo the selected option
     */
    selectedOptionId() {
      let selectedModifierOption = this.$store.state.viewedItemSelectedModifiers.filter(
        option => option.modifier_id === this.modifier.id
      );
      if (selectedModifierOption.length) {
        return selectedModifierOption[0]["id"];
      }
      return null;
    },
    hasErrors() {
      return this.$store.state.viewedItemModifiersWithErrors.filter(
        mod => mod.id === this.modifier.id
      ).length;
    }
  },
  methods: {
    /**
     * Format item price from cents to dollars
     * @item item which price is being calculated
     */
    itemPrice(item) {
      return (item["price_money"]["amount"] / 100).toFixed(2);
    },
    /**
     * Select an option
     * @param option - the option to be selected
     */
    selectOption(option) {
      option.modifier_id = this.modifier.id;
      option.modifier_name = this.modifier.name;
      option.modifier_type = this.modifier.selection_type;
      // for free options add price of 0
      if (!option.price_money) {
        option.price_money = {
          amount: 0,
          currency: ""
        };
      }
      this.$store.commit("setViewedItemSelectedModifiers", option);
    },
    /**
     * Uppercase first letter of the option name
     * @param name
     * @returns {string} Option name
     */
    optionName(name) {
      return `${name[0].toUpperCase()}${name.slice(1)}`;
    }
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
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
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
      margin-top: 6px;
    }

    &__note.error {
      padding: 0 4px;
      font-family: "Roboto-Bold", sans-serif;
      border-radius: 3px;
      color: #f65956;
      box-shadow: 4px 4px 9px #f65956;
    }
  }
  &_body__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    cursor: pointer;
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
