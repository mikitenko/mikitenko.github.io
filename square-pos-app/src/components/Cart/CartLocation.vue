<template>
  <div class="location-radio-wrapper">
    <div class="location-radio-item">
      <div
        @click.prevent="changeOrderLocation('dine in')"
        class="radio_button"
        :class="{ selected: orderLocationOption === 'dine in' }"
      >
        <div
          class="radio_button__selected"
          v-if="orderLocationOption === 'dine in'"
        >
          <div class="radio_button_checker"></div>
        </div>
        <div
          class="radio_button__blank"
          v-if="orderLocationOption !== 'dine in'"
        ></div>
        <span class="radio_button__label">
          Dine In
        </span>
      </div>
    </div>
    <div class="location-radio-item">
      <div
        @click.prevent="changeOrderLocation('pick up')"
        class="radio_button"
        :class="{ selected: orderLocationOption === 'pick up' }"
      >
        <div
          class="radio_button__selected"
          v-if="orderLocationOption === 'pick up'"
        >
          <div class="radio_button_checker"></div>
        </div>
        <div
          class="radio_button__blank"
          v-if="orderLocationOption !== 'pick up'"
        ></div>
        <span class="radio_button__label">
          Pick Up
        </span>
      </div>
      <div
        v-if="location"
        v-show="orderLocationOption === 'pick up'"
        class="location-button"
      >
        <div @click.prevent="changeLocation" class="address-text">
          <p>
            {{ location.address.address_line_1 }}
          </p>
          <p>
            {{ location.address.locality }},
            {{ location.address.administrative_district_level_1 }},
            {{ location.address.postal_code }}
          </p>
        </div>

        <iframe
          name="mapframe"
          width="60"
          height="60"
          frameborder="0"
          style="border:0"
          :src="
            `https://www.google.com/maps?q=${location.address.address_line_1}&amp;z=11&amp;f=d&amp;output=embed`
          "
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CartLocation",
  computed: {
    location() {
      return this.$store.state.currentLocation;
    },
    orderLocationOption() {
      return this.$store.state.orderLocationOption;
    }
  },
  methods: {
    changeLocation() {
      this.$router.push({
        name: "location",
        params: this.$route.params,
        query: { cart: true }
      });
    },
    changeOrderLocation(type) {
      this.$store.commit("setOrderLocationOption", type);
    }
  },
  async created() {
    if (!this.$store.state.currentLocation)
      await this.$store.dispatch("getCurrentLocation", this.$route.params.id);
  }
};
</script>

<style scoped lang="scss">
.location-radio-wrapper {
  padding: 15px;
  border-bottom: 15px solid #eff0f2;
  .location-radio-item {
    border: 1px solid #e8e8e8;
    margin-bottom: 15px;
    &:last-child {
      margin: 0;
    }
  }
  .radio_button {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    &.selected {
      background: #e8f8ff;
    }
    &__blank {
      height: 24px;
      width: 24px;
      background-color: #fafafa;
      border-radius: 50%;
      border: 1px solid #979797;
    }
    &__selected {
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background-color: #1fb6ff;
      border: 1px solid #1fb6ff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &_checker {
      border-radius: 50%;
      height: 12px;
      width: 12px;
      background-color: #fafafa;
    }
    &__label {
      margin-left: 15px;
      font-weight: bold;
      font-size: 17px;
      color: #4a4a4a;
    }
  }

  .location-button {
    overflow: hidden;
    padding-left: 50px;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
    .address-text {
      float: left;
      width: calc(100% - 60px);
      font-size: 14px;
      color: #4a4a4a;
      cursor: pointer;
      &:hover {
        color: #1fb6ff;
      }
      p {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        padding-right: 10px;
        box-sizing: border-box;
      }
      p:first-child {
        margin-bottom: 3px;
      }
      .icon-right-open-big {
        display: inline-block;
        font-size: 16px;
        margin-left: 10px;
      }
    }
    iframe {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
