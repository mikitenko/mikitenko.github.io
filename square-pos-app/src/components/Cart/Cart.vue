<template>
  <div class="cart">
    <cart-header />
    <div
      class="cart-body"
      :class="{ 'overflow-visible': !showBtn || $store.state.viewedItem.id }"
    >
      <cart-location></cart-location>
      <div class="cart_upper">
        <div class="cart_upper-title roboto-medium">ITEMS IN YOUR ORDER</div>
        <div class="cart_upper-link" @click="goToMenu()">Add Items</div>
      </div>
      <cart-items-list />
      <div class="cart_input__wrapper">
        <input
          placeholder="Leave a note or special instructions"
          class="cart_input"
          v-model="orderComment"
        />
      </div>
      <cart-tips
        @showBtn="showBtn = $event"
        :total-price="totalPriceCalculator"
      />
      <cart-summary :total-price="totalPriceCalculator" />
    </div>
    <cart-place-order @showPaymentModal="togglePaymentModal(true)" />
    <payment-modal
      v-if="showPaymentModal"
      @closePaymentModal="togglePaymentModal(false)"
    />
  </div>
</template>

<script>
import CartHeader from "./CartHeader";
import CartLocation from "./CartLocation";
import CartItemsList from "./CartItemsList";
import CartTips from "./CartTips";
import CartSummary from "./CartSummary";
import CartPlaceOrder from "./CartPlaceOrder";
import PaymentModal from "./PaymentModal";

export default {
  name: "Cart",
  components: {
    PaymentModal,
    CartLocation,
    CartPlaceOrder,
    CartSummary,
    CartTips,
    CartItemsList,
    CartHeader
  },
  data() {
    return {
      showPaymentModal: false,
      orderComment: "",
      showBtn: true,
      summary: {
        currency: "USD",
        subtotal: 12
      }
    };
  },
  async created() {
    this.$store.commit("setAppId", this.$route.params.id);

    if (!this.$store.state.connectedToSquare) {
      this.$store.commit("setAppId", this.$route.params.id);
      const successs = await this.$store.dispatch(
        "checkConnection",
        this.$route.params.id
      );
      if (!successs) {
        this.$router.push({ path: "/disconnected" });
      }
    }
    // get Items on created
    if (!this.$store.state.itemsInCart.length) {
      await this.$store.dispatch("getItemsInCart");
    }
  },
  computed: {
    /**
     * @return total price of the items in the card
     */
    totalPriceCalculator() {
      return this.$store.state.itemsInCart.reduce(
        (sum, item) => sum + parseFloat(item.price),
        0
      );
    }
  },
  methods: {
    /**
     * On click by 'Add Items' button change route to home;
     */
    goToMenu() {
      this.$router.push({
        name: "home",
        params: { id: this.$store.state.appId }
      });
    },
    /**
     * Open payment modal
     */
    togglePaymentModal(val) {
      this.showPaymentModal = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.cart {
  &-body {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    height: calc(100% - 135px);
    &.overflow-visible {
      overflow: visible;
      height: calc(100% - 60px);
      & + .cart-place {
        display: none;
      }
    }
  }
  &_upper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 20px 15px 15px;
    &-title {
      text-transform: uppercase;
      color: #9b9b9b;
      font-size: 16px;
    }
    &-link {
      color: #40baf3;
      font-size: 15px;
      cursor: pointer;
    }
  }
  &_input__wrapper {
    border-bottom: 1px solid #c1c1c1;
    border-top: 1px solid #c1c1c1;
    width: 100%;
    margin-top: 40px;
  }
  &_input {
    background: #fafafa;
    width: 100%;
    padding: 0 20px;
    height: 55px;
    font-size: 16px;
    border: none;
    &::placeholder {
      color: #d6d6d6;
      opacity: 1;
      font-size: 16px;
    }

    &:-ms-input-placeholder {
      color: #d6d6d6;
      font-size: 16px;
    }

    &::-ms-input-placeholder {
      color: #d6d6d6;
      font-size: 16px;
    }
  }
}
</style>
