<template>
  <div>
    <app-header></app-header>
    <app-main></app-main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Header from "../Header.vue";
import Main from "../Main.vue";

@Component({
  name: "app",
  components: {
    "app-header": Header,
    "app-main": Main
  }
})
export default class App extends Vue {
  created() {}
}
</script>

<style lang="scss">
</style>
