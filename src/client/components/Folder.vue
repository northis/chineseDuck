<template>
  <virtual-scroller class="scroller" :items="folders" item-height="42" content-tag="table">
    <template slot-scope="props">
      <td>
        {{props.name}}
      </td>
    </template>
  </virtual-scroller>
</template>

<script  lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import Component from "vue-class-component";
import { State } from "vuex-class";
import * as T from "../types/interfaces";
import * as ST from "../store/types";
import { Provide } from "vue-property-decorator";
import { getStoreAccessors } from "vuex-typescript";
import folder from "../store/folder";
import Grid from "./Grid.vue";
const scroller = require("vue-virtual-scroller");
Vue.component("virtual-scroller", scroller.VirtualScroller);

@Component
export default class Folder extends Vue {
  @State folder: T.IFolderState;

  mounted() {
    this.store.dispatch(folder.actions.fetchFolders)(this.$store);
  }

  get store() {
    return getStoreAccessors<T.IFolderState, ST.IRootState>(ST.Modules.folder);
  }

  get folders() {
    return this.store.read(folder.getters.getFolders)(this.$store);
  }

  created() {}
}
</script>

<style lang="scss">
// @import "../assets/styles/mainStyles.scss";
// @import "../../../node_modules/vue-";
// .fixed-scroller {
//   @extend .scroller;
// }
</style>
