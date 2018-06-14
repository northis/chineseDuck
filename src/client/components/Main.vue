<template>
  <div role="main" id="app-main">
    <app-folder> </app-folder>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { State, Action, Getter } from "vuex-class";
import Component from "vue-class-component";
import Folder from "./Folder.vue";

@Component({
  components: {
    "app-folder": Folder
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
  min-height: 100%;
}
body {
  //margin-bottom: 40px;
  width: 100%;
  height: 100%;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  // height: 40px;
  // line-height: 40px;
}
</style>
