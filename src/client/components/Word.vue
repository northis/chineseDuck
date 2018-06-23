<template>
  <div>
    Words
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as I from "../types/interfaces";
import * as ST from "../store/types";
import Component from "vue-class-component";
import { getStoreAccessors } from "vuex-typescript";
import folder from "../store/folder";

@Component
export default class Word extends Vue {
  mounted() {}

  get store() {
    return getStoreAccessors<I.IFolderState, ST.IRootState>(ST.Modules.folder);
  }

  get currentFolder() {
    return this.store.read(folder.getters.getCurrentFolder)(this.$store);
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
