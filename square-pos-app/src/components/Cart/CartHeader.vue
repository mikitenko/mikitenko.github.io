<template>
  <div class="ch">
    <div class="close-icon-box" @click="goToMenu()">
      <div class="close"></div>
    </div>
    <div class="ch-title roboto-bold">Order</div>
  </div>
</template>

<script>
export default {
  name: "CartHeader",
  methods: {
    goToMenu() {
      this.$router.push({
        name: "home",
        params: { id: this.$store.state.appId }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ch {
  height: 60px;
  background-color: #2c3c47;
  display: flex;
  width: 100%;

  &-title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% + 36px);
    color: #ffffff;
    font-size: 16px;
  }

  .close-icon-box {
    cursor: pointer;
    .close {
      position: absolute;
      left: 12px;
      top: 18px;
      width: 24px;
      height: 24px;
      opacity: 0.8;
    }
    .close:hover {
      opacity: 1;
    }
    .close:before,
    .close:after {
      position: absolute;
      left: 10px;
      content: " ";
      height: 24px;
      width: 3px;
      background-color: #ffffff;
    }
    .close:before {
      transform: rotate(45deg);
    }
    .close:after {
      transform: rotate(-45deg);
    }
  }
}
</style>
