<template>
  <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column container">
    <header>
      <app-header></app-header>
    </header>
    <main role="main"
          class="mainBackground"
          id="app-main">
      <router-view></router-view>
    </main>
    <footer class="mastfoot mt-auto text-center"
            v-if="RouteName != 'Word'"
            v-html="Footer">
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { State, Action, Getter } from "vuex-class";
import Component from "vue-class-component";
import Header from "./Header.vue";
import { Provide } from "vue-property-decorator";
import { getFooterMarkupLine } from "../../../config/common";

@Component({
  name: "app",
  components: {
    "app-header": Header
  }
})
export default class Main extends Vue {
  @Provide() Footer = getFooterMarkupLine();

  get RouteName() {
    return this.$route ? this.$route.name : "";
  }

  mounted() {
    console.log("Main mounted");
  }
  created() {}
}
</script>

<style lang="scss">
@import "../assets/styles/mainStyles.scss";

html {
  height: 100%;
  box-sizing: border-box;
  position: relative;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  position: relative;
  margin: 0;
  width: 100%;
}

.footer {
  padding-top: 2em;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
}

p {
  margin: 0;
}

.mainBackground {
  background: $workColor;
  margin-top: $mainMargin;
}
</style>
