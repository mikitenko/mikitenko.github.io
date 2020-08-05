<template>
  <div v-if="$store.state.currentLocation">
    <home-header />
    <template v-if="!isLoadingMenuItems">
      <home-top-nav />
      <home-body />
      <home-view-order />
    </template>
    <div class="loader-container" v-else>
      <request-loader />
    </div>
  </div>
  <div class="loader-container" v-else>
    <request-loader />
  </div>
</template>

<script>
import HomeHeader from "./HomeHeader";
import HomeBody from "./HomeBody/HomeBody";
import HomeTopNav from "./HomeTopNav";
import RequestLoader from "../Global/RequestLoader";
import HomeViewOrder from "./HomeBody/HomeViewOrder";

export default {
  name: "Home",
  components: {
    HomeViewOrder,
    RequestLoader,
    HomeBody,
    HomeHeader,
    HomeTopNav
  },
  async created() {
    let res = await this.$store.dispatch(
      "getCurrentLocation",
      this.$route.params.id
    );
    if (!res)
      return this.$router.push({
        name: "location",
        params: this.$route.params
      });

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
    if (!this.menuItems.length) {
      await this.$store.dispatch("getItems");
    }
    // get Items in cart
    await this.$store.dispatch("getItemsInCart");
  },
  computed: {
    /**
     * Indicates if the categories are being loaded
     */
    isLoadingMenuItems() {
      return this.$store.state.loadingMenuItemsList;
    },
    /**
     * Get menu categories from store
     */
    menuCategories() {
      return this.$store.state.categories;
    },
    /**
     * Returns menu items from store
     * @returns {*}
     */
    menuItems() {
      return this.$store.state.items;
    }
  }
};
</script>

<style lang="scss" scoped>
.loader-container {
  margin-top: 50%;
  position: relative;
}
</style>
