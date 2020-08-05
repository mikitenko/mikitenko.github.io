<template>
  <div class="order-details-summary">
    <div class="order-details-summary_sub">
      <div>Subtotal</div>
      <div>{{ currency }}{{ priceFormat(subtotal) }}</div>
    </div>
    <div class="order-details-summary_sub">
      <div>TAX</div>
      <div>{{ currency }}{{ priceFormat(order.order_tax) }}</div>
    </div>
    <div v-if="Number(order.order_tips)" class="order-details-summary_sub">
      <div>Tips</div>
      <div>{{ currency }}{{ priceFormat(order.order_tips) }}</div>
    </div>
    <div class="order-details-summary_total roboto-medium">
      <div>TOTAL</div>
      <div class="order-details-summary_total_value">
        {{ currency }}{{ priceFormat(order.order_total) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CartSummary",
  props: {
    order: {
      required: true,
      type: Object
    }
  },
  computed: {
    /**
     * Get the currency of the order
     */
    currency() {
      return this.$getCurrency(this.order.order_currency).label;
    },
    /**
     * Get subtotal
     */
    subtotal() {
      return (
        Number(this.order.order_total) -
        Number(this.order.order_tax) -
        Number(this.order.order_tips)
      );
    }
  },
  methods: {
    priceFormat(price) {
      let str = String(price);
      str =
        str.substring(0, str.length - 2) + "." + str.substring(str.length - 2);
      if (str[0] === ".") str = "0" + str;
      return str;
    }
  }
};
</script>

<style lang="scss" scoped>
.order-details-summary {
  border-top: 1px solid #e4e4e4;
  padding: 20px 15px;
  background: #ffffff;
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
    margin-top: 20px;
    &_value {
      color: #7ed321;
    }
  }
}
</style>
