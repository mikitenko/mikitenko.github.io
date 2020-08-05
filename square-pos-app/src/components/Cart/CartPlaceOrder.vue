<template>
  <div class="cart-place" @click="showPaymentModal">
    <div class="roboto-bold">Place order</div>
  </div>
</template>

<script>
export default {
  name: "CartPlaceOrder",
  methods: {
    /**
     * On click open payment modal
     */
    showPaymentModal() {
      this.$emit("showPaymentModal");
    }
  }
};
</script>

<style lang="scss" scoped>
.cart-place {
  z-index: 1;
  background-color: #1fb6ff;
  height: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  position: fixed;
  bottom: 10px;
  width: calc(100% - 30px);
  margin: 0 15px;
  border-radius: 27px;
  cursor: pointer;
}
</style>
