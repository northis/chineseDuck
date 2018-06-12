<template>
  <div id="app-main">
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { State, Action, Getter } from "vuex-class";
import Component from "vue-class-component";

@Component
export default class Main extends Vue {
  mounted() {
    console.log("Main mounted");
  }
  created() {}
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/mainStyles.scss";

html,
body {
  height: 100%;
  width: unset;
  display: unset;
  align-items: unset;
  justify-content: unset;
}
</style>
