<template>
  <div class="app-not-connected">
    <div v-if="$isHideHeader" class="close-icon-box" @click="closeApp">
      <div class="close"></div>
    </div>
    <img src="../../assets/images/scandi-app-not-found.png" alt="" />
    <p class="oops">Oops!</p>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: "Disconnected",
  data() {
    return {
      message: "There seems to be a problem with the Aplication setup."
    };
  },
  methods: {
    closeApp() {
      window.parent.postMessage(`scandi-close-app`, "*");
    }
  },
  created() {
    if (this.$route.name === "disconnected") {
      this.message = "This Application is not connected to Square.";
    }
  }
};
</script>

<style lang="scss" scoped>
.app-not-connected {
  padding: 120px 30px 0 30px;
  text-align: center;

  .oops {
    font-size: 24px;
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .scandi-logo {
    margin-bottom: 20px;
    height: 80px;
  }
  .description {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .btn-wrapper {
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
  }
  .btn {
    border-radius: 3px;
    padding: 0 15px 0 15px;
    color: #fff;
    display: flex;
    align-items: center;
    font-weight: 500;
    cursor: pointer;
    height: 40px;
    background: #1fb6ff;
    border: none;
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
      background-color: #43494d;
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
