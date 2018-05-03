<template>
</template>

<script lang="ts">
import Vue from "vue";
import { State } from "vuex-class";
import * as T from "../types/interfaces";
import Component from "vue-class-component";

@Component
export default class Logout extends Vue {
  @State auth: T.IAuthState;

  mounted() {
    this.
    this.$router.push('/');
  }
}
</script>

<style scoped>

</style>
