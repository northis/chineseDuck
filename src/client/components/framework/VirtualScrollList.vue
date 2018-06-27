<template>
  <virtual-list :size="100"
                :remain="20">
    <slot/>
  </virtual-list>
</template>

<script>
import Vue from "vue";
import virtualList from "vue-virtual-scroll-list";
Vue.component("virtual-list", virtualList);
export default {
  data() {
    return {};
  }
};
</script>

<style scoped>
</style>