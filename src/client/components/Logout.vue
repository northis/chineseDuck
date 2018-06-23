<template>
</template>

<script lang="ts">
import Vue from "vue";
import * as I from "../types/interfaces";
import * as ST from "../store/types";
import Component from "vue-class-component";
import { getStoreAccessors } from "vuex-typescript";
import auth from "../store/auth";

@Component
export default class Logout extends Vue {
  mounted() {
    this.store
      .dispatch(auth.actions.logout)(this.$store)
      .then(a => {
        this.$router.push("/");
        document.body.style.display = "flex";
      });
  }

  get store() {
    return getStoreAccessors<I.IAuthState, ST.IRootState>(ST.Modules.auth);
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/mainStyles.scss";

body {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
