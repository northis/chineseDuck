<template>
  <select class="combobox form-control" v-model="selectedValue">
    <slot />
    <template v-if="useFullList">
      <option disabled selected hidden value="">
        <slot name="Header" />
      </option>
      <option disabled/>
      <slot name="FullList" />
    </template>
  </select>
</template>

<script>
export default {
  watch: {
    selectedValue: {
      handler: "selectedChanged",
      immediate: true,
      deep: false
    }
  },

  methods: {
    selectedChanged(val, oldVal) {
      this.$emit("selectedChanged", val);
    }
  },

  data() {
    const cBpxJs = require("../../../node_modules/@danielfarrell/bootstrap-combobox/js/bootstrap-combobox.js");
    let cb = $(".combobox");
    cb.combobox();

    return { selectedValue: "", useFullList: true };
  }
};
</script>

<style scoped>
@import "../../../node_modules/@danielfarrell/bootstrap-combobox/css/bootstrap-combobox.css";
</style>