<template>
  <div>
    <div class="header">
      <div class="header-title roboto-bold">Select your location</div>
    </div>
    <div v-if="locations" class="location-list">
      <div
        v-for="location in locations"
        :key="location.id"
        class="location-wrapper"
      >
        <div
          :class="{
            'current-location': $store.state.currentLocation.id === location.id
          }"
          class="location-item"
        >
          <div class="address">
            <div @click.prevent="selectLocation(location)" class="icon-wrapper">
              <i class="icon-location-outline"></i>
            </div>
            <div @click.prevent="selectLocation(location)" class="address-text">
              <p>{{ location.name }}</p>
              <p class="descriptions">{{ location.address.address_line_1 }}</p>
              <p class="descriptions">
                {{ location.address.locality }},
                {{ location.address.administrative_district_level_1 }},
                {{ location.address.postal_code }}
              </p>
            </div>
            <iframe
              name="mapframe"
              width="99"
              height="99"
              frameborder="0"
              style="border:0"
              :src="
                `https://www.google.com/maps?q=${location.address.address_line_1}&amp;z=11&amp;f=d&amp;output=embed`
              "
            ></iframe>
          </div>
          <div v-if="location.workingHours" class="work-time">
            <div class="icon-wrapper">
              <i class="icon-clock"></i>
            </div>
            <div
              class="days-list"
              :class="{
                open: isLocationOpen(location),
                close: !isLocationOpen(location)
              }"
            >
              <p @click.prevent="toggleDays(location)">
                <span v-if="!isLocationOpen(location)" class="status"
                  >Closed now</span
                >
                <span v-if="isLocationOpen(location)" class="status"
                  >Open now</span
                >
                <span v-if="isLocationOpen(location)">
                  - Closes at
                  {{ getLocationCloseTime(location).end_time }}</span
                >
                <i v-if="!location.showDays" class="icon-down-open-big"></i>
                <i v-if="location.showDays" class="icon-up-open-big"></i>
              </p>
              <transition name="slide-fade">
                <div v-if="location.showDays" class="days">
                  <!-- eslint-disable -->
                  <div
                    v-for="hr in location.workingHours"
                    :class="{
                      current: days[currentDay.getDay()] === hr.start_week_day
                    }"
                    class="day-item"
                  >
                    <span class="day-name">{{
                      weekDays[hr.start_week_day]
                    }}</span>
                    <span class="day-time-from-to"
                      >{{ hr.start_time }} - {{ hr.end_time }}</span
                    >
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <div class="gray-line"></div>
      </div>
    </div>
  </div>
</template>

<script>
import SquareService from "@/api/square";
export default {
  name: "Location",
  data() {
    return {
      days: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
      weekDays: {
        MON: "Monday",
        TUE: "Tuesday",
        WED: "Wednesday",
        THU: "Thursday",
        FRI: "Friday",
        SAT: "Saturday",
        SUN: "Sunday"
      }
    };
  },
  computed: {
    locations() {
      return this.$store.state.locations;
    },
    currentDay() {
      return new Date();
    },
    currentTime() {
      let hours = this.currentDay.getHours();
      return hours;
    }
  },
  methods: {
    async selectLocation(location) {
      const response = await SquareService.setLocation(
        this.$route.params.id,
        location.id
      );
      if (response.status === 200 && response.data) {
        this.$store.commit("setCurrentLocation", response.data);
        if (this.$route.query.cart) {
          this.$router.push({
            name: "cart",
            params: this.$route.params,
            query: {}
          });
        } else {
          this.$router.push({ name: "home", params: this.$route.params });
        }
      }
    },
    toggleDays(location) {
      location.showDays = !location.showDays;
    },
    isLocationOpen(location) {
      let locationWorkDay = location.workingHours.filter(key => {
        return (
          key.start_week_day.indexOf(this.days[this.currentDay.getDay()]) !== -1
        );
      })[0];
      let startTime = Number(locationWorkDay.start_time.split(":")[0]);
      let endTime = Number(locationWorkDay.end_time.split(":")[0]);
      if (locationWorkDay.start_time.indexOf("PM") !== -1) startTime += 12;
      if (locationWorkDay.end_time.indexOf("PM") !== -1) endTime += 12;
      if (startTime > this.currentTime) {
        return false;
      } else if (startTime <= this.currentTime && startTime > endTime) {
        return true;
      } else if (startTime <= this.currentTime && endTime > this.currentTime) {
        return true;
      } else {
        return false;
      }
    },
    getLocationCloseTime(location) {
      return location.workingHours.filter(key => {
        return (
          key.start_week_day.indexOf(this.days[this.currentDay.getDay()]) !== -1
        );
      })[0];
    }
  },
  async created() {
    if (!this.$store.state.currentLocation)
      await this.$store.dispatch("getCurrentLocation", this.$route.params.id);
    if (!this.$store.state.locations.length)
      await this.$store.dispatch("getLocations", this.$route.params.id);
  }
};
</script>

<style scoped lang="scss">
.header {
  height: 60px;
  display: flex;
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
}

.location-list {
  position: fixed;
  top: 59px;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: auto;
  .location-item {
    position: relative;
    &.current-location {
      border: 2px solid #1fb6ff;
    }
    .work-time,
    .address {
      font-size: 17px;
      overflow: hidden;
      .icon-wrapper {
        width: 60px;
        line-height: 40px;
        margin-top: 25px;
        text-align: center;
        float: left;
        i {
          color: #1fb6ff;
          font-size: 22px;
        }
      }
    }
    .address {
      cursor: pointer;
      &:hover {
        p{
          color: #1fb6ff!important;
        }
      }
      .address-text {
        padding: 20px 0;
        width: calc(100% - 159px);
        float: left;
        p {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
          padding-right: 10px;
          box-sizing: border-box;
        }
        p:first-child {
          margin-bottom: 7px;
          font-weight: bold;
        }

        p.descriptions{
          font-size: 14px;
          color: #4a4a4a;
        }
      }
      iframe {
        float: left;
      }
    }
    .work-time {
      .icon-wrapper {
        margin-top: 14px;
      }

      .days-list {
        padding: 20px 0;
        width: calc(100% - 60px);
        float: left;
        border-top: 1px solid #d8d8d8;
        color: #4a4a4a;
        p {
          cursor: pointer;
        }
        i {
          margin-left: 10px;
          cursor: pointer;
        }
        &.open {
          > p > span.status {
            color: #7ed321;
          }
        }

        &.close {
          > p > span.status {
            color: #ff0625;
          }
        }

        .days {
          margin-top: 15px;
          font-size: 15px;
          .day-item {
            overflow: hidden;
            margin-bottom: 5px;
            padding-right: 87px;
            &.current {
              font-weight: bold;
              color: #000;
            }
            .day-name {
              float: left;
            }
            .day-time-from-to {
              float: right;
            }
          }

          @media (max-width: 420px) {
            .day-item {
              padding-right: 15px;
            }
          }
        }
      }
    }
  }
  .gray-line {
    width: 100%;
    height: 10px;
    background: #eff0f2;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
