<template>
  <div class="header">
    <div v-if="$isHideHeader" class="close-icon-box" @click="closeApp">
      <div class="close"></div>
    </div>
    <div class="header-title roboto-bold">Menu</div>
    <router-link :to="{ name: 'location' }" class="location-icon">
      <i class="icon-location-outline"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "HomeHeader",
  methods: {
    closeApp() {
      window.parent.postMessage(`scandi-close-app`, "*");
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  display: flex;
  position: relative;
  border-bottom: 1px solid #d8d8d8;
  width: 100%;
  background: #fafafa;

  &-title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% + 36px);
    color: #43494d;
    font-size: 20px;
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
      background-color: #43494d;
    }
    .close:before {
      transform: rotate(45deg);
    }
    .close:after {
      transform: rotate(-45deg);
    }
  }
  .location-icon {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    color: #9b9b9b;
    line-height: 60px;
    text-align: center;
    cursor: pointer;
    font-size: 24px;
    &:hover {
      color: #40baf3;
    }
  }
}
</style>
