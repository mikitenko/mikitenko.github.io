<template>
  <div class="order-details-items">
    <div
      v-for="item in order.item_list"
      :key="item.sid"
      class="order-details-item"
    >
      <div class="order-details-item_left">
        <div class="order-details-item_left__quant roboto-medium">
          {{ item.quantity }}
        </div>
        <div>
          <div class="order-details-item_left__name roboto-medium">
            <span>{{ item.name }}</span>
            <ul
              v-if="item.modifiers.length"
              class="order-details-item_modifiers-list"
            >
              <li
                v-for="mod in item.modifiers"
                :key="mod.id"
                class="order-details-item_modifier"
              >
                {{ mod.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="order-details-item_price roboto-bold">
        {{ $getCurrency(item.currency).label }}{{ item.price }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderDetailsItemsList",
  props: {
    order: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
.order-details {
  &-items {
    width: 100%;
    padding: 20px 15px;
  }
  &-item {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    &:first-child {
      margin: 0;
    }
    &_left {
      display: flex;
      align-items: flex-start;
      &__quant {
        font-size: 16px;
        margin-right: 20px;
        min-width: 20px;
        display: inline-block;
      }
      &__name {
        font-size: 16px;
      }
    }
    &_price {
      font-size: 16px;
      display: inline-block;
      min-width: 80px;
      text-align: right;
    }
    &_modifiers-list {
      margin-top: 6px;
      list-style: none;
      padding: 0;
    }
    &_modifier {
      text-transform: capitalize;
      color: #9b9b9b;
      line-height: 22px;
      font-weight: 400;
      font-size: 14px;
    }
  }
}
</style>
