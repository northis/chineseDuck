<template>
  <div class="custom-control custom-checkbox">
    <input type="checkbox" class="custom-control-input" id="inputRemember" v-model="isChecked">
    <label class="custom-control-label" for="inputRemember">
      <slot/>
    </label>
  </div>
</template>

<script>
export default {
  watch: {
    isChecked: {
      handler: "isCheckedChanged",
      immediate: true,
      deep: false
    }
  },

  methods: {
    isCheckedChanged(val, oldVal) {
      this.$emit("checkedChanged", val);
    }
  },

  data() {
    return { isChecked: false };
  }
};
</script>

<style lang="scss" scoped>

</style>