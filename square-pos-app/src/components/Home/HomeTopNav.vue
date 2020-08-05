<template>
  <div class="nav">
    <template v-for="cat in menuCategories">
      <div
        :key="cat.id"
        class="nav-item roboto-bold"
        :class="{ selected: isSelected(cat.id) }"
        @click="selectItem(cat.id)"
        :id="`nav-${cat.id}`"
      >
        {{ cat.name }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "HomeTopNav",
  computed: {
    /**
     * Get menu categories from store
     */
    menuCategories() {
      return this.$store.getters.nonEmptyItems;
    },
    selectedCategoryId() {
      return this.$store.state.selectedCategoryId;
    }
  },
  methods: {
    /**
     * Check if the current item in the list is selected to apply the styles
     * @param id - id of the item
     * @returns {boolean} true if the item is selected
     */
    isSelected(id) {
      return this.selectedCategoryId === id;
    },
    /**
     * Select the item on click
     * @param id - id of the item to be selected
     */
    selectItem(id) {
      this.$store.commit("setClickSelect", true);
      this.$store.commit("setSelectedCategoryId", id);
      this.showTopNavItem(id);
      let vm = this;
      this.$scrollTo(`#${id}`, 500, {
        easing: "linear",
        container: ".m-body",
        onDone: function() {
          vm.$store.commit("setClickSelect", false);
        }
      });
    },
    showTopNavItem(itemId) {
      let navScrollOffset = document.querySelector(".nav")["scrollLeft"];
      let navWidth = document.querySelector(".nav")["offsetWidth"];
      let selectedMenuItemOffset = document.getElementById(`nav-${itemId}`)[
        "offsetLeft"
      ];
      let selectedMenuItemWidth = document.getElementById(`nav-${itemId}`)[
        "offsetWidth"
      ];
      if (selectedMenuItemOffset < navScrollOffset) {
        document.querySelector(".nav")["scrollLeft"] =
          document.querySelector(".nav")["scrollLeft"] - selectedMenuItemWidth;
      } else if (
        selectedMenuItemOffset + selectedMenuItemWidth >
        navScrollOffset + navWidth
      ) {
        document.querySelector(".nav")["scrollLeft"] =
          document.querySelector(".nav")["scrollLeft"] + selectedMenuItemWidth;
      }
    }
  },
  created() {
    if (this.menuCategories.length) {
      this.$store.commit("setSelectedCategoryId", this.menuCategories[0].id);
    }
  }
};
</script>

<style lang="scss" scoped>
.nav::-webkit-scrollbar {
  display: none;
}

.nav {
  height: 45px;
  border-bottom: 1px solid #c1c1c1;
  box-shadow: 0 1px 3px rgba(74, 74, 74, 0.5);
  display: flex;
  align-items: center;
  overflow-y: hidden;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;

  &-item {
    color: #9b9b9b;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 0 10px;
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    white-space: nowrap;
    border-bottom: 2px solid #ffffff;
    border-top: 2px solid #ffffff;
  }
  &-item.selected {
    color: #1fb6ff;
    border-bottom: 2px solid #1fb6ff;
  }
}
</style>
