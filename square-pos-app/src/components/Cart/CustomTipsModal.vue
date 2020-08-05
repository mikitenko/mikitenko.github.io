<template>
  <div class="modal-wrapper" @click="overlayClick">
    <form class="modal-form" @submit.prevent="saveTips">
      <div class="modal-form__box">
        <p class="modal-form__desc">Enter other amount</p>
        <div class="modal-form__input-wrapper">
          <span
            :style="{ left: `calc(50% - ${calcLength}` }"
            class="modal-form__input-label"
            >{{ currency }}</span
          >
          <input
            ref="input"
            class="modal-form__input"
            inputmode="decimal"
            :value="tipsAmount"
            @input="inputHandler"
          />
        </div>
        <div class="modal-form__amount">
          Your order amount was {{ currency }}{{ amount }}
        </div>
      </div>
      <button
        :class="{ active: tipsAmount }"
        class="modal-form__button"
        type="submit"
      >
        Save
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "CustomTipsModal",
  props: {
    amount: {
      type: Number,
      default: 0.0
    },
    currency: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      tipsAmount: "0.00"
    };
  },
  computed: {
    calcLength() {
      return 40 + 20 * 0.82 * this.tipsAmount.toString().length + "px";
    }
  },
  methods: {
    inputHandler(event) {
      if (!isNaN(+event.data) && event.data !== " ") {
        this.tipsAmount = event.target.value;
      } else {
        if (
          event.data === "." &&
          event.target.value.indexOf(".") !== -1 &&
          event.target.value.indexOf(".") ===
            event.target.value.lastIndexOf(".")
        ) {
          this.tipsAmount = event.target.value;
        } else {
          event.target.value = event.target.value.slice(0, -1);
        }
      }
    },
    overlayClick(ev) {
      if (ev.target === ev.currentTarget) {
        this.$emit("closeModal");
      }
    },
    saveTips() {
      this.$emit("saveTips", +this.tipsAmount);
    }
  },
  mounted() {
    this.$refs.input.focus();
    if (this.$store.state.selectedTip.amount) {
      this.tipsAmount = this.$store.state.selectedTip.amount;
    }
    this.$refs.input.select();
  }
};
</script>

<style scoped lang="scss">
.modal-wrapper {
  z-index: 5000;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .modal-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    position: fixed;
    bottom: 0;
    z-index: 1000;
    height: 280px;
    width: 100%;
    background: #fff;
  }
  .modal-form__box {
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1 0;
    width: 100%;
  }
  .modal-form__desc {
    color: #373a3e;
    font-size: 16px;
    text-align: center;
  }
  .modal-form__input-wrapper {
    display: flex;
    justify-content: center;
    position: relative;
  }
  .modal-form__input-label {
    color: #a4a4ae;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 58px;
    position: absolute;
  }
  .modal-form__input {
    color: #a4a4ae;
    font-size: 58px;
    border: none;
    text-align: center;
    background: transparent;
  }
  .modal-form__amount {
    text-align: center;
    color: #a4a4ae;
    font-size: 14px;
  }
  .modal-form__button {
    pointer-events: none;
    font-size: 16px;
    border: none;
    color: white;
    height: 58px;
    background: #a4a4ae;
    width: 100%;
    &.active {
      background: #7ed321;
      pointer-events: auto;
      cursor: pointer;
    }
  }
}
</style>
