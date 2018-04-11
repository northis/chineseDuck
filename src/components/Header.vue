<template>
    <header>
        <h1>{{ getRootState.appName }}</h1>
    </header>
</template>

<script  lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State, Action, Getter } from "vuex-class";
import { IRootState } from "../types/interfaces";

@Component
export default class Header extends Vue {
  @Getter getRootState: IRootState;

  mounted() { 
    console.log("Header mounted");
    //this.fetchData();
  }
  created() {
    //this.product4;
  }
}
</script>

<style scoped>
</style>
