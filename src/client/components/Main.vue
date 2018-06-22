<template>
  <div class="container">
    <app-header></app-header>
    <main role="main"
          class="mainBackground"
          id="app-main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { State, Action, Getter } from "vuex-class";
import Component from "vue-class-component";
import Header from "./Header.vue";

@Component({
  name: "app",
  components: {
    "app-header": Header
  }
})
export default class Main extends Vue {
  mounted() {
    console.log("Main mounted");
  }
  created() {}
}
</script>

<style lang="scss">
@import "../assets/styles/mainStyles.scss";

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
