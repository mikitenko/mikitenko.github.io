<template>
  <div class="tips">
    <div class="tips-wrapper">
      <div class="tips-title roboto-medium">Tips</div>
      <div class="tips-box">
        <div
          v-for="tip in tipTypes"
          :key="tip.name"
          class="tips_tip"
          :class="{ selected: isSelectedTip(tip) }"
          @click="selectTip(tip)"
        >
          <template v-if="isOtherTip(tip) && isOtherTip(selectedTip)">
            <div class="tips_tip__name">
              {{ currency }}{{ (+selectedTip.amount).toFixed(2) }}
            </div>
            <div class="tips_tip__amount">Edit</div>
          </template>
          <template v-else>
            <div class="tips_tip__name">{{ tip.name }}</div>
            <template v-if="!isOtherTip(tip)">
              <div class="tips_tip__amount">
                {{ currency }}{{ calculateTipAmount(tip) }}
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
    <custom-tips-modal
      v-if="showModal"
      @closeModal="closeModal"
      @saveTips="saveCustomTips"
      :amount="totalPrice"
      :currency="currency"
    />
  </div>
</template>

<script>
import CustomTipsModal from "./CustomTipsModal";

export default {
  name: "CartTips",
  components: {
    CustomTipsModal
  },
  props: {
    totalPrice: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      showModal: false,
      tipTypes: [
        {
          name: "10%",
          amount: 10
        },
        {
          name: "15%",
          amount: 15
        },
        {
          name: "20%",
          amount: 20
        },
        {
          name: "Other",
          amount: 0.0
        }
      ]
    };
  },
  computed: {
    /**
     * Get the currency of the order
     */
    currency() {
      if (this.$store.state.itemsInCart.length) {
        return this.$getCurrency(this.$store.state.itemsInCart[0].currency)
          .label;
      }
      return "";
    },
    selectedTip() {
      return this.$store.state.selectedTip;
    }
  },
  methods: {
    closeModal() {
      this.showModal = false;
      this.$emit("showBtn", true);
      if (!this.$store.state.selectedTip.amount) {
        this.selectTip({});
      }
    },
    saveCustomTips(ev) {
      const tip = {
        name: "Other",
        amount: (+ev).toFixed(2)
      };
      this.selectTip(tip);
      this.$store.commit("setSelectedTip", tip);
      this.showModal = false;
      this.$emit("showBtn", true);
    },
    /**
     * Check if the tip is of type "Other"
     * @param tip - tip to check
     * @returns {boolean} true if the button type is "Other"
     */
    isOtherTip(tip) {
      return tip.name === "Other";
    },
    /**
     * Calculate the tip size
     * @param tip - tip to calculate
     * @returns {number} the size of the tip
     */
    calculateTipAmount(tip) {
      return ((this.totalPrice * tip.amount) / 100).toFixed(2);
    },
    /**
     * On click select / deselect tip
     * @param tip
     */
    selectTip(tip) {
      if (tip.name === "Other") {
        this.showModal = true;
        this.$emit("showBtn", false);
        if (!this.isSelectedTip(tip)) {
          this.$store.commit("setSelectedTip", tip);
        }
      } else {
        this.$store.commit("setSelectedTip", tip);
      }
    },
    isSelectedTip(tip) {
      if (this.$store.state.selectedTip.name) {
        return this.$store.state.selectedTip.name === tip.name;
      }
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
.tips {
  border-bottom: 1px solid #c1c1c1;
  &-wrapper {
    padding: 20px 15px 10px 15px;
  }
  &-title {
    text-transform: uppercase;
    color: #9b9b9b;
    font-size: 16px;
    margin: 0 0 15px 0;
  }
  &-box {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  &_tip.selected {
    background-color: #1fb6ff;
    .tips_tip__name,
    .tips_tip__amount {
      color: #ffffff;
    }
  }

  &_tip {
    flex: 1 0 18%;
    background-color: #f2f2f2;
    height: 55px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 10px;
    cursor: pointer;

    &__name {
      color: #4a4a4a;
      font-size: 15px;
    }

    &__amount {
      color: #9b9b9b;
      font-size: 12px;
      margin-top: 5px;
    }
  }
  &_tip:not(:last-child) {
    margin-right: 5px;
  }
}
</style>
