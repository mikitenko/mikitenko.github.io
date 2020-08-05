<template>
  <div v-if="order" class="order-details">
    <order-details-header :order="order" />
    <div class="order-details-from">
      <div>
        <p class="order-details-from_name roboto-medium">
          {{ order.location_info.business_name }}
        </p>
        <p class="order-details-from_address roboto-medium">
          {{ order.location_info.address.address_line_1 }},
          {{ order.location_info.address.locality }},
          {{ order.location_info.address.administrative_district_level_1 }}
          {{ order.location_info.address.postal_code }}
        </p>
      </div>
    </div>
    <div class="order-details_upper">
      <div>{{ order.card_info.card_brand }} {{ order.card_info.last_4 }}</div>
      <div>{{ dateFormat(order.created_at) }}</div>
    </div>
    <div class="order-details-body">
      <order-details-items-list :order="order" />
    </div>
    <order-details-summary :order="order" />
    <div class="order-details-lastg"></div>
  </div>
  <request-loader v-else class="od-request-loader" />
</template>

<script>
import SquareApi from "@/api/square";
import OrderDetailsHeader from "./OrderDetailsHeader";
import OrderDetailsItemsList from "./OrderDetailsItemsList";
import OrderDetailsSummary from "./OrderDetailsSummary";
import RequestLoader from "../Global/RequestLoader";

export default {
  name: "OrderDetails",
  components: {
    RequestLoader,
    OrderDetailsSummary,
    OrderDetailsItemsList,
    OrderDetailsHeader
  },
  computed: {
    order() {
      return this.$store.state.orderDetails;
    }
  },
  methods: {
    dateFormat(date) {
      let time;
      let monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];

      date = new Date(date);

      let day = date.getDate();
      let monthIndex = date.getMonth();
      let year = date.getFullYear();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      time = hours + ":" + minutes + " " + ampm;
      day = Number(day) < 10 ? "0" + day : day;
      return monthNames[monthIndex] + " " + day + ", " + year + " at " + time;
    },
    async getOrderDetails() {
      let response = await SquareApi.getOrderDetails({
        appId: this.$route.params.id,
        orderId: this.$route.params.orderId
      });

      if (response.status === 200) {
        this.$store.commit("setOrderDetails", response.data);
      }
    }
  },
  created() {
    if (
      !this.$store.state.orderDetails ||
      Number(this.$store.state.orderDetails.id) !==
        Number(this.$route.params.orderId)
    ) {
      this.getOrderDetails();
    }
  }
};
</script>

<style lang="scss" scoped>
.od-request-loader {
  top: 50%;
  position: absolute;
  margin-top: -32px;
}
.order-details {
  background: #eceef1;
  &-from {
    background-color: #2c3c47;
    color: #ffffff;
    height: 115px;
    box-sizing: border-box;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      text-align: center;
    }
    &_name {
      font-size: 16px;
      margin-bottom: 15px;
    }
  }
  &-body {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    max-height: calc(100% - 425px);
    background: #ffffff;
  }
  &-lastg {
    width: 100%;
    height: 15px;
    overflow: hidden;
    background: url("../../assets/images/order-triangle.png");
  }
  &_upper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: #ffffff;
    height: 70px;
    padding: 25px 15px;
    border-bottom: 1px solid #e4e4e4;
  }
}
</style>
