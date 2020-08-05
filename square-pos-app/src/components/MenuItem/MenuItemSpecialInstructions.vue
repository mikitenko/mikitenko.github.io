<template>
  <div class="inst">
    <div class="inst_header">
      <div class="inst_header__title roboto-medium">Special Instructions</div>
      <div class="inst_header__note">Leave a note or special instructions</div>
    </div>
    <div class="inst_input__wrapper">
      <input class="inst_input" v-model="instruction" @input="updateMessage" />
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuItemSpecialInstructions",
  data() {
    return {
      instruction: ""
    };
  },
  methods: {
    updateMessage(e) {
      this.$store.commit("setViewedItemNote", e.target.value);
    }
  }
};
</script>

<style lang="scss" scoped>
.inst {
  background-color: #ffffff;
  padding: 20px 0 0 0;
  height: 100px;
  flex-direction: column;
  display: flex;
  width: 100%;
  margin-bottom: 10px;

  &_header {
    margin-bottom: 20px;
    padding: 0 20px;

    &__title {
      text-transform: uppercase;
      color: #9b9b9b;
      font-size: 15px;
    }
    &__note {
      margin-top: 20px;
      font-size: 16px;
      color: #d6d6d6;
    }
  }

  &_input__wrapper {
    border-bottom: 1px solid #c1c1c1;
    width: 100%;
  }

  &_input {
    width: 100%;
    padding: 0 20px;
    height: 25px;
    font-size: 16px;
    background-color: #ffffff;
    border: none;
  }
}
</style>
