<template>
  <div>
    <app-virtualScrollList id="wordScroller"
                           class="list-group">

      <div class="list-group-item list-group-item-action flex-column align-items-start d-flex w-100 justify-content-between"
           v-for="word in words"
           :key="word._id">
        <div class="container nopadding">
          <div class="row">
            <div class="col">
              {{word.originalWord}}

            </div>
          </div>
        </div>
      </div>
    </app-virtualScrollList>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as I from "../types/interfaces";
import { State } from "vuex-class";
import * as ST from "../store/types";
import Component from "vue-class-component";
import { Provide } from "vue-property-decorator";
import { getStoreAccessors } from "vuex-typescript";
import word from "../store/word";
import VirtualScrollList from "./framework/VirtualScrollList.vue";
import { isNullOrUndefined } from "util";
@Component({
  components: {
    "app-virtualScrollList": VirtualScrollList
  }
})
export default class Word extends Vue {
  @State word: I.IWordState;
  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize);

    const idFolder = +this.$route.params.id;
    this.store.dispatch(word.actions.fetchWords)(this.$store, idFolder);
  }
  destroyed() {
    window.removeEventListener("resize", this.resize);
  }

  get store() {
    return getStoreAccessors<I.IWordState, ST.IRootState>(ST.Modules.word);
  }

  get words() {
    return this.store.read(word.getters.getWords)(this.$store);
  }

  resize() {
    const scroller = document.getElementById("wordScroller");

    if (isNullOrUndefined(scroller)) return;

    const allheight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    const scrollerOffset = $(scroller).offset();

    if (isNullOrUndefined(scrollerOffset)) return;

    const topOffset = scrollerOffset.top;
    scroller.style.height = (allheight - topOffset).toString() + "px";
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/mainStyles.scss";
</style>
