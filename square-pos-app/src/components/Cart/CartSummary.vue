<template>
  <div class="card-summary">
    <!--    Card Number: 4111 1111 1111 1111-->
    <!--    MM/YY: 12/21 (you provide any month and year that is in the future)-->
    <!--    CVV: 111-->
    <!--    Postal: 11111 (you can provide any postal code).-->
    <div class="card-summary_sub">
      <div>Subtotal</div>
      <div>{{ currency }}{{ parseFloat(totalPrice).toFixed(2) }}</div>
    </div>
    <div v-if="tax" class="card-summary_sub">
      <div>TAX</div>
      <div>{{ currency }}{{ tax }}</div>
    </div>
    <div class="card-summary_sub" v-if="tipAmount">
      <div>Tips</div>
      <div>{{ currency }}{{ tipAmount }}</div>
    </div>
    <div class="card-summary_total roboto-medium">
      <div>TOTAL</div>
      <div>{{ currency }}{{ total }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CartSummary",
  props: {
    totalPrice: {
      required: true,
      type: Number
    }
  },
  computed: {
    /**
     * Get the currency of the order
     */
    currency() {
      if (this.$store.state.itemsInCart.length) {
        return this.$getCurrency(this.$store.state.itemsInCart[0].currency)
          .label;
      } else return "";
    },
    /**
     * Return tip amount
     */
    tip() {
      return this.$store.state.selectedTip;
    },
    /**
     * Return tax amount
     */
    tax() {
      if (this.$store.state.itemsInCartTaxes.tax) {
        return (this.$store.state.itemsInCartTaxes.tax / 100).toFixed(2);
      }
      return false;
    },
    /**
     * Calculate the tip size
     * @returns {number} the size of the tip
     */
    tipAmount() {
      if (this.tip.amount && this.tip.name !== "Other") {
        return ((this.totalPrice * this.tip.amount) / 100).toFixed(2);
      } else if (this.tip.amount && this.tip.name === "Other") {
        return (+this.tip.amount).toFixed(2);
      }
      return false;
    },
    /**
     * Calculate the total price
     * @returns {number} the price
     */
    total() {
      let tip = 0;
      let taxes = 0;
      if (this.tipAmount) {
        tip = parseFloat(this.tipAmount);
      }
      if (this.tax) {
        taxes = parseFloat(this.tax);
      }
      return (tip + taxes + this.totalPrice).toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
.card-summary {
  padding: 20px 15px;
  margin-bottom: 40px;
  &_sub {
    display: flex;
    justify-content: space-between;
    color: #9b9b9b;
    font-size: 16px;
    margin-bottom: 10px;
  }
  &_total {
    display: flex;
    justify-content: space-between;
    color: #4a4a4a;
    font-size: 16px;
  }
}
</style>
