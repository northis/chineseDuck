<template>
    <header>
        <h1>{{ getRootState.appName }}</h1>
    </header>
</template>

<script  lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State, Action, Getter } from "vuex-class";
import { RootState } from "../store/types";

@Component
export default class Header extends Vue {
  @Getter getRootState: RootState;

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
