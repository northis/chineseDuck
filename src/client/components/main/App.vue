<template>
  <div class="container">
    <app-header></app-header>
    <app-main class="mainBackground"></app-main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Provide } from "vue-property-decorator";
import Header from "../Header.vue";
import Main from "../Main.vue";
import { getFooterMarkup } from "../../../../config/common";

@Component({
  name: "app",
  components: {
    "app-header": Header,
    "app-main": Main
  }
})
export default class App extends Vue {
  @Provide() Footer = getFooterMarkup();
  created() {}
}
</script>

<style lang="scss">
@import "../../assets/styles/mainStyles.scss";

html {
  position: relative;
}
body {
  width: 100%;
}

p {
  margin: 0;
}

.mainBackground {
  background: $workColor;
  margin-top: $mainMargin;
}
</style>
