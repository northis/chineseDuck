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
  created () {
  }
}
</script>

<style scoped>
</style>
