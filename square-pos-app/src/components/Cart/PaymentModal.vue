<template>
  <div
    class="payment-modal-container"
    :class="{ 'white-bg': hideForm }"
    @click.self="closePaymentModal"
  >
    <div>
      <div v-if="!hideForm" id="form-container">
        <div id="sq-card-number" class="card-number-box"></div>
        <div class="third" id="sq-expiration-date"></div>
        <div class="third" id="sq-cvv"></div>
        <div class="third" id="sq-postal-code"></div>
        <button
          id="sq-creditcard"
          class="button-credit-card"
          @click.stop="onGetCardNonce($event)"
        >
          Pay
        </button>
        <div v-if="errors.length" class="errors">
          <p v-for="error in errors" :key="error.message">
            {{ error.message }}
          </p>
        </div>
      </div>
      <div class="payment-form-loader" v-if="!paymentFormIsLoaded">
        <request-loader class="payment-form-loader_rings" />
        <div class="payment-form-loader_note">Waiting response from Square</div>
      </div>
    </div>
    <order-placed-modal :showOrderPlacedModal="showOrderPlacedModal" />
  </div>
</template>

<script>
import SquareService from "@/api/square";
import OrderPlacedModal from "./OrderPlacedModal";
import RequestLoader from "../Global/RequestLoader";

export default {
  name: "PaymentModal",
  components: {
    RequestLoader,
    OrderPlacedModal
  },
  data() {
    return {
      errors: [],
      hideForm: false,
      paymentFormIsLoaded: false,
      showOrderPlacedModal: false,
      paymentForm: null,
      paymentFormConfig: {
        // Initialize the payment form elements
        //TODO: Replace with your application ID
        applicationId: process.env.VUE_APP_SQUARE_APP_ID,
        inputClass: "sq-input",
        autoBuild: false,
        // Customize the CSS for SqPaymentForm iframe elements
        inputStyles: [
          {
            fontSize: "16px",
            lineHeight: "24px",
            padding: "16px",
            placeholderColor: "#a0a0a0",
            backgroundColor: "transparent"
          }
        ],
        // Initialize the credit card placeholders
        cardNumber: {
          elementId: "sq-card-number",
          placeholder: "Card Number"
        },
        cvv: {
          elementId: "sq-cvv",
          placeholder: "CVV"
        },
        expirationDate: {
          elementId: "sq-expiration-date",
          placeholder: "MM/YY"
        },
        postalCode: {
          elementId: "sq-postal-code",
          placeholder: "Postal"
        },
        // SqPaymentForm callback functions
        callbacks: {
          cardNonceResponseReceived: this.cardNonceResponseReceived,
          paymentFormLoaded: () => {
            this.paymentFormIsLoaded = true;
          }
        }
      }
    };
  },
  methods: {
    onGetCardNonce(event) {
      // Don't submit the form until SqPaymentForm returns with a nonce
      event.preventDefault();
      // Request a nonce from the SqPaymentForm object
      this.paymentForm.requestCardNonce();
    },
    closePaymentModal() {
      this.$emit("closePaymentModal");
    },
    cardNonceResponseReceived(errors, nonce, cardData) {
      if (errors) {
        // Log errors from nonce generation to the browser developer console.
        console.error("Encountered errors:");
        this.errors = errors;
        errors.forEach(function(error) {
          console.error("  " + error.message);
        });
        console.log(
          "Encountered errors, check browser developer console for more details"
        );
        return;
      }
      this.sendOrder(nonce);
    },
    async sendOrder(nonce) {
      let totalPrice = this.$store.state.itemsInCart.reduce(
        (sum, item) => sum + parseFloat(item.price),
        0
      );
      let tips = 0;
      if (this.$store.state.selectedTip.amount) {
        tips = (totalPrice * this.$store.state.selectedTip.amount).toFixed();
      }
      let response = await SquareService.processPayment({
        appId: this.$store.state.appId,
        data: {
          nonce: nonce,
          tips: tips,
          fulfillment_option: this.$store.state.orderLocationOption
        }
      });

      if (response && response.status === 200) {
        // clear all the order data
        this.$store.commit("setItemsInCart", []);
        this.$store.commit("setItemsInCartTaxes", {});
        this.$store.commit("setSelectedTip", {});
        this.$store.commit("setOrderDetails", response.data);
        this.$store.commit("setOrderLocationOption", "dine in");
        this.showOrderPlacedModal = true;
        this.hideForm = true;
        setTimeout(
          function(response) {
            this.showOrderPlacedModal = false;

            setTimeout(
              function(response) {
                this.$router.push({
                  name: "order-details",
                  params: {
                    id: this.$store.state.appId,
                    orderId: response.data.id
                  }
                });
              }.bind(this),
              500,
              response
            );
          }.bind(this),
          1000,
          response
        );
      } else {
        this.errors = [response.data];
      }
    }
  },
  mounted() {
    // eslint-disable-next-line
    this.paymentForm = new SqPaymentForm(this.paymentFormConfig);
    this.paymentForm.build();
  },
  beforeDestroy() {
    this.paymentForm.destroy();
  }
};
</script>
<style lang="scss">
.payment-form-loader {
  position: relative;
  top: -235px;
  z-index: 220;
  height: 235px;
  background: white;
  padding: 20px 15px;
  border-radius: 20px;
  max-width: 500px;
  margin: 0 10px 0 10px;
  &_note {
    margin: 140px auto 0;
    font-size: 14px;
    font-family: "Roboto-Medium", sans-serif;
    text-align: center;
  }
  &_rings {
    margin-top: 60px;
  }
}

.payment-modal-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.79);
  &.white-bg {
    background-color: #ffffff !important;
  }
}

#form-container {
  background-color: #ffffff;
  margin: calc(50vh - 150px) 10px 0 10px;
  padding: 20px 15px;
  border-radius: 20px;
  max-width: 500px;
  position: relative;
  z-index: 200;

  #sq-ccbox {
    float: left;
    margin: 5px;
    padding: 10px;
    vertical-align: top;
    font-weight: bold;
  }

  #nonce-form {
    padding: 25px;
    text-align: right;
  }

  .sq-input {
    display: inline-block;
    float: left;
  }

  .sq-input--focus {
    border: 1px solid #4a90e2;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.1);
  }

  .sq-input--error {
    border: 1px solid red;
  }

  .card-number-box {
    min-height: 56px;
    margin-bottom: 15px;
    border: 1px solid #e0e2e3;
    border-radius: 4px;
  }

  .third {
    float: left;
    width: calc((100% - 32px) / 3);
    padding: 0;
    margin: 0 15px 15px 0;
    height: 56px;
    min-height: 56px;
    border: 1px solid #e0e2e3;
    border-radius: 4px;
  }

  .third:last-of-type {
    margin-right: 0;
  }

  .label {
    font-size: 18px;
    font-weight: bold;
    line-height: 24px;
    padding-right: 16px;
  }

  .button-credit-card {
    display: block;
    width: 100%;
    height: 56px;
    padding: 15px;
    margin-top: 10px;
    background: #0eb00e;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    cursor: pointer;
    color: #ffffff;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    outline: none;
  }
  .errors {
    padding-top: 10px;
    text-align: center;
    p {
      font-size: 14px;
      color: #f65956;
    }
  }
}
</style>
