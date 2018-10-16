<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-nopadding">
        <div class="margin-top">
          <div class="input-group">
            <input type="text"
                   class="form-control"
                   placeholder="Find words..."></div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-nopadding">
        <!-- <div class="progress margin-noside">
            <div class="progress-bar progress-bar-striped progress-bar-animated"
                 role="progressbar"
                 aria-valuenow="100"
                 aria-valuemin="0"
                 aria-valuemax="100"
                 style="width: 100%" />

                 
          </div> -->
        <app-virtualScrollList id="wordScroller"
                               class="list-group marginagble">
          <div class="list-group-item list-group-item-action flex-column align-items-start d-flex w-100 justify-content-between"
               v-for="word in words"
               :key="word._id">
            <div class="container nopadding"
                 :width="word.full.width"
                 :height="word.full.height">
              <div class="row">
                <div class="col">
                  <!-- TODO Relative path -->
                  <img :src="getFileIdPath(word.full.id)"
                       :height="word.full.height"
                       :width="word.full.width" />
                </div>

                <div class="col">
                  <div class="d-flex flex-column mb-3">
                    <div class="p-2">{{word.originalWord}}</div>
                    <div class="p-2">{{word.pronunciation.replace(/\|/g," ")}}</div>
                    <div class="p-2">{{word.translation}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </app-virtualScrollList>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as I from "../types/interfaces";
import { State } from "vuex-class";
import * as ST from "../store/types";
import Component from "vue-class-component";
import { Provide, Emit } from "vue-property-decorator";
import { getStoreAccessors } from "vuex-typescript";
import word from "../store/word";
import VirtualScrollList from "./framework/VirtualScrollList.vue";
import { isNullOrUndefined } from "util";
import { route, routes } from "../services/routeService";
@Component({
  components: {
    "app-virtualScrollList": VirtualScrollList
  }
})
export default class Word extends Vue {
  @State
  word: I.IWordState;
  @Provide()
  IsLoading = false;

  counter = 0;

  getFileIdPath(idFile: string) {
    return route(routes._word_file__fileId_, idFile);
  }

  loadImage(wordItem: I.IWord) {
    this.counter++;
    console.info(this.counter);

    // if (!isNullOrUndefined(wordItem.file))
    //   this.store.dispatch(word.actions.fetchWordFile)(this.$store, wordItem);
  }

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

    var computedStyle = getComputedStyle(scroller);

    const topOffset = scrollerOffset.top;
    const marginBottom = +(computedStyle.marginBottom || "0").replace("px", "");
    const marginTop = +(computedStyle.marginTop || "0").replace("px", "");

    scroller.style.height =
      (allheight - topOffset - marginBottom - marginTop).toString() + "px";
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/mainStyles.scss";
</style>
