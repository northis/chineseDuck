<template>
  <div>
    <app-header></app-header>
    <app-main></app-main>
    <footer class="footer">
      <div class="container">
        <app-footer></app-footer>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Header from "../Header.vue";
import Main from "../Main.vue";
import Footer from "../Footer.vue";

@Component({
  name: "app",
  components: {
    "app-header": Header,
    "app-main": Main,
    "app-footer": Footer
  }
})
export default class App extends Vue {
  created() {}
}
</script>

<style lang="scss">
@import "../../assets/styles/mainStyles.scss";

html,
body {
  height: unset;
  width: unset;
  display: unset;
  align-items: unset;
  justify-content: unset;
}
</style>
