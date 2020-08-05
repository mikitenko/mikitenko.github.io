<template>
  <div class="category" :id="category.id || category.name">
    <div class="category_name">{{ category.name }}</div>
    <template v-for="item in category.items">
      <home-category-item :key="item.id" :item="item" class="category_item" />
    </template>
  </div>
</template>

<script>
import HomeCategoryItem from "./HomeCategoryItem";
export default {
  name: "HomeCategory",
  components: {
    HomeCategoryItem
  },
  props: {
    category: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
.category {
  background: #fafafa;
  margin-bottom: 10px;
  &_name {
    text-transform: uppercase;
    color: #787878;
    font-size: 16px;
    font-family: "Roboto-Bold", sans-serif;
    padding: 15px 15px 0 15px;
  }
  &_item:not(:last-child) {
    border-bottom: 1px solid #e4e4e4;
  }
}
</style>
