<template>
  <transition name="order-placed-out">
    <div v-if="show" id="order-placed-modal">
      <div class="order-placed-content">
        <p>Order is placed</p>
        <div class="checkmark-wrapper">
          <div class="checkmark">
            <div class="checkmark_stem"></div>
            <div class="checkmark_kick"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "OrderPlacedModal",
  props: {
    showOrderPlacedModal: {
      required: true,
      type: Boolean
    }
  },
  computed: {
    show() {
      return this.showOrderPlacedModal;
    }
  }
};
</script>
<style lang="scss">
#order-placed-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 201;
  background-color: #7ed321;
  .order-placed-content {
    position: absolute;
    height: 165px;
    top: 40%;
    left: 0;
    right: 0;
    margin-top: -82px;
  }

  p {
    color: #ffffff;
    font-size: 26px;
    text-align: center;
    margin-bottom: 35px;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.order-placed-out-leave-active {
  animation-duration: 0.5s;
  animation-fill-mode: both;
  animation-name: fadeOut;
}

.checkmark-wrapper {
  position: relative;
  margin: auto;
  width: 100px;
  height: 100px;
  background: #ffffff;
  border-radius: 100%;
  .checkmark {
    display: inline-block;
    position: absolute;
    width: 30px;
    height: 30px;
    margin-top: -20px;
    margin-left: -7px;
    left: 50%;
    top: 50%;
    -ms-transform: rotate(33deg);
    -webkit-transform: rotate(33deg);
    transform: rotate(33deg);
  }
  .checkmark_stem {
    position: absolute;
    width: 7px;
    height: 30px;
    background-color: #7ed321;
    left: 11px;
    top: 6px;
    border-radius: 15px;
  }
  .checkmark_kick {
    position: absolute;
    width: 17px;
    height: 7px;
    background-color: #7ed321;
    left: 0;
    top: 28px;
    -ms-transform: rotate(10deg);
    -webkit-transform: rotate(10deg);
    transform: rotate(10deg);
    border-radius: 15px;
  }
}
</style>
