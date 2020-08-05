<template>
  <div class="mm">
    <div class="mm_header">
      <div class="mm_header__title roboto-medium">
        {{ modifier.name }}
      </div>
      <div
        class="mm_header__note"
        :class="{ error: hasErrors }"
        v-if="modifier.min_selected_modifiers && !minimumSelected"
      >
        Minimum options to select: {{ modifier.min_selected_modifiers }}
      </div>
      <div
        class="mm_header__note"
        v-if="modifier.max_selected_modifiers && !maximumSelected"
      >
        Maximum options to select:
        {{ modifier.max_selected_modifiers }}
      </div>
    </div>
    <div class="mm_body">
      <div
        v-for="option in modifier.modifiers"
        :key="option.id"
        class="mm_body__item"
        @change="optionSelected(option)"
      >
        <label
          class="mm-container"
          :class="{ disabled: maximumSelected && !isSelected(option.id) }"
        >
          <input
            type="checkbox"
            :id="option.id"
            :value="option.id"
            v-model="selectedOptions"
            :disabled="maximumSelected && !isSelected(option.id)"
          />
          <span class="mm-checkmark"></span>
          <span class="mm-container_label">
            <span class="mm-container_name">{{ optionName(option.name) }}</span>
            <template
              v-if="option.price_money && option.price_money.amount > 0"
            >
              <span class="mm-container_price">
                {{ $getCurrency(option.price_money.currency).label
                }}{{ itemPrice(option) }}
              </span>
            </template>
            <span class="mm-container_price" v-else>Free</span>
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuItemModifiersMultiple",
  props: {
    modifier: {
      required: true,
      type: Object
    },
    selectedModifiers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedOptions: []
    };
  },
  computed: {
    /**
     * Check if the maximum amount of options is selected
     */
    maximumSelected() {
      if (this.modifier.max_selected_modifiers) {
        return (
          this.selectedOptions.length >= this.modifier.max_selected_modifiers
        );
      }
      return false;
    },
    minimumSelected() {
      return (
        this.selectedOptions.length >= this.modifier.min_selected_modifiers
      );
    },
    hasErrors() {
      return this.$store.state.viewedItemModifiersWithErrors.filter(
        mod => mod.id === this.modifier.id
      ).length;
    }
  },
  methods: {
    /**
     * Check if the option selected
     */
    isSelected(id) {
      return this.selectedOptions.indexOf(id) >= 0;
    },
    // TODO add validation for min - max num of options
    /**
     * Format item price from cents to dollars
     * @item item which price is being calculated
     */
    itemPrice(item) {
      return (item["price_money"]["amount"] / 100).toFixed(2);
    },
    /**
     * Update price / add new details to item description in store
     */
    optionSelected(option) {
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
  },
  mounted() {
    if (this.$store.state.viewedItemSelectedModifiers) {
      const modifiersIds = this.modifier.modifiers.map(el => el.id);
      this.selectedOptions = this.$store.state.viewedItemSelectedModifiers
        .map(el => el.id)
        .filter(el => modifiersIds.indexOf(el) !== -1);
    }
  }
};
</script>

<style lang="scss" scoped>
.mm {
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

  &_body__item:not(:last-child) {
    border-bottom: 1px solid #e4e4e4;
  }

  &_body {
    &__item {
      padding: 10px 20px;

      .mm-container.disabled {
        .mm-checkmark {
          background-color: #979797;
        }
      }

      /* The container */
      .mm-container {
        display: block;
        position: relative;
        padding-left: 45px;
        cursor: pointer;
        user-select: none;
        &_label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          height: 25px;
        }
        &_name {
          color: #4a4a4a;
          display: inline-block;
        }
        &_price {
          color: #7ed321;
          display: inline-block;
        }
      }

      /* Hide the browser's default checkbox */
      .mm-container input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
      }

      /* Create a custom checkbox */
      .mm-checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: #ffffff;
        border: 1px solid #979797;
      }

      /* When the checkbox is checked, add a blue background */
      .mm-container input:checked ~ .mm-checkmark {
        background-color: #1fb6ff;
        border: 1px solid #1fb6ff;
      }

      /* Create the checkmark/indicator (hidden when not checked) */
      .mm-checkmark:after {
        content: "";
        position: absolute;
        display: none;
      }

      /* Show the checkmark when checked */
      .mm-container input:checked ~ .mm-checkmark:after {
        display: block;
      }

      /* Style the checkmark/indicator */
      .mm-container .mm-checkmark:after {
        left: 8px;
        top: 4px;
        width: 7px;
        height: 12px;
        border: solid white;
        border-width: 0 2px 2px 0;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
      }
    }
  }
}
</style>
