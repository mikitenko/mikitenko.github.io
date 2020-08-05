<template>
  <div class="vo" @click="goToCart" v-if="itemsInCart.length">
    <div class="vo-box">
      <div class="vo-num">{{ itemsInCart.length }}</div>
    </div>
    <div class="vo-title">View Order</div>
    <div class="vo-price">${{ itemsInCartPrice }}</div>
  </div>
</template>

<script>
export default {
  name: "HomeViewOrder",
  computed: {
    itemsInCart() {
      return this.$store.state.itemsInCart;
    },
    itemsInCartPrice() {
      let price = this.$store.state.itemsInCart.reduce(
        (totalPrice, item) => totalPrice + parseFloat(item.price),
        0
      );
      return price.toFixed(2);
    }
  },
  methods: {
    goToCart() {
      this.$router.push({
        name: "cart",
        params: { id: this.$store.state.appId }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.vo {
  background-color: #2c3c47;
  height: 60px;
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  margin: 0 10px;
  padding: 0 20px;
  border-radius: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &-box {
    width: 80px;
  }
  &-num {
    height: 32px;
    width: 32px;
    background-color: #979797;
    color: #ffffff;
    border-radius: 6px;
    font-size: 12px;
    font-family: "Roboto-Medium", sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-title {
    font-size: 15px;
    font-family: "Roboto-Bold", sans-serif;
    color: #ffffff;
  }
  &-price {
    width: 80px;
    text-align: right;
    font-size: 12px;
    font-family: "Roboto-Medium", sans-serif;
    color: #ffffff;
  }
}
</style>
