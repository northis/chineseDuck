<template>
  <main role="main" id="app-main">
    <app-folder> </app-folder>
  </main>
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
</style>
