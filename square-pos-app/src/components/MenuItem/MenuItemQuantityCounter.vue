<template>
  <div class="cntr roboto-bold">
    <div class="cntr_left" @click="decreaseQuantity()">&mdash;</div>
    <div class="cntr_middle">{{ $store.state.viewedItemSelectedQuantity }}</div>
    <div class="cntr_right" @click="increaseQuantity()">+</div>
  </div>
</template>

<script>
export default {
  name: "MenuItemQuantityCounter",
  methods: {
    /**
     * Increase the amount of the items to be added to cart
     */
    increaseQuantity() {
      this.$store.commit(
        "setViewedItemSelectedQuantity",
        this.$store.state.viewedItemSelectedQuantity + 1
      );
    },
    /**
     * Decrease the amount of the items to be added to cart. Min amount is 1.
     */
    decreaseQuantity() {
      if (this.$store.state.viewedItemSelectedQuantity > 1) {
        this.$store.commit(
          "setViewedItemSelectedQuantity",
          this.$store.state.viewedItemSelectedQuantity - 1
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.cntr {
  display: flex;
  height: 55px;
  color: #1fb6ff;
  text-align: center;
  font-size: 19px;
  border-radius: 30px;
  box-shadow: 1px 2px 2px #b1b1b1;
  margin-right: 10px;

  &_left {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 55px;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    border-left: 1px solid #e4e4e4;
    border-top: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    cursor: pointer;
  }
  &_middle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 55px;
    border: 1px solid #e4e4e4;
  }
  &_right {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 55px;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
    border-top: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;
  }
}
</style>
