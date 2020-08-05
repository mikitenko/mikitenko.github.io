<template>
  <div
    class="m-body"
    @scroll="onItemsScroll($event)"
    :style="{
      height: $store.state.itemsInCart.length
        ? 'calc(100% - 185px)'
        : 'calc(100% - 105px)'
    }"
    :class="{ 'overflow-visible': viewedItemId }"
  >
    <template v-for="category in menuItems">
      <home-category :category="category" :key="category.id" />
    </template>
  </div>
</template>

<script>
import HomeCategory from "./HomeCategory";

export default {
  name: "HomeBody",
  components: {
    HomeCategory
  },
  data() {
    return {
      headerHeight: 110,
      timeout: null
    };
  },
  computed: {
    /**
     * Indicates if the categories are being loaded
     */
    isLoadingMenuItems() {
      return this.$store.state.loadingMenuItemsList;
    },
    /**
     * Returns menu items from store
     * filtered to have at least one item to show
     * @returns {*}
     */
    menuItems() {
      return this.$store.getters.nonEmptyItems;
    },
    /**
     * Return array of menu items ids
     */
    menuItemsIds() {
      return this.$store.getters.nonEmptyItems.map(item => {
        return item.id;
      });
    },
    viewedItemId() {
      return this.$store.state.viewedItem.id;
    }
  },
  methods: {
    onItemsScroll(e) {
      if (this.$store.state.isClickSelect) {
        return false;
      }
      let scrolledItemsIds = this.menuItemsIds.filter(id => {
        let itemElement = document.getElementById(id);
        return itemElement.offsetTop - this.headerHeight < e.target.scrollTop;
      });
      let currentItemId = scrolledItemsIds[scrolledItemsIds.length - 1];
      this.$store.commit("setSelectedCategoryId", currentItemId);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.scrollTopNav(currentItemId);
      }, 65);
    },
    scrollTopNav(currentItemId) {
      if (this.$store.state.isHorizontalScroll) {
        return false;
      }
      let navScrollOffset = document.querySelector(".nav")["scrollLeft"];
      let navWidth = document.querySelector(".nav")["offsetWidth"];
      let selectedMenuItemOffset = document.getElementById(
        `nav-${currentItemId}`
      )["offsetLeft"];
      let selectedMenuItemWidth = document.getElementById(
        `nav-${currentItemId}`
      )["offsetWidth"];
      let vm = this;
      if (selectedMenuItemOffset < navScrollOffset) {
        this.$scrollTo(`#nav-${currentItemId}`, 300, {
          container: ".nav",
          easing: "ease-out",
          x: true,
          y: false,
          onStart: function() {
            vm.$store.commit("setHorizontalScroll", true);
          },
          onDone: function() {
            vm.$store.commit("setHorizontalScroll", false);
          }
        });
      } else if (
        selectedMenuItemOffset + selectedMenuItemWidth >
        navScrollOffset + navWidth
      ) {
        this.$scrollTo(`#nav-${currentItemId}`, 300, {
          container: ".nav",
          easing: "ease-out",
          offset: navWidth / 2,
          x: true,
          y: false,
          onStart: function() {
            vm.$store.commit("setHorizontalScroll", true);
          },
          onDone: function() {
            vm.$store.commit("setHorizontalScroll", false);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-body::-webkit-scrollbar {
  display: none;
}
.m-body {
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  background-color: #eff0f2;
  &.overflow-visible {
    overflow: visible;
  }
}
.loader-container {
  margin-top: 140px;
  position: relative;
}
</style>
