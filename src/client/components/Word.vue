<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-nopadding">
        <div class="margin-top">
          <div class="input-group">
            <input type="text"
                   class="form-control"
                   v-model="SearchText"
                   placeholder="Find words...">
          </div>
        </div>
      </div>
    </div>

    <div class="row align-items-center"
         v-show="!isLoading">

      <div class="col-auto nopadding">
        <div class="margin-top">
          <div class="input-group">
            <div class="input-group-prepend">
              <button type="button"
                      disabled
                      style="opacity: 1; background: transparent; border-color: transparent"
                      class="btn btn-light">
                <b>{{"/" + currentFolderName}}</b></button>

            </div>
          </div>
        </div>
      </div>

      <div class="col">

      </div>
      <div class="col-auto nopadding">
        <div class="margin-top">
          <div class="input-group">
            <button type="button"
                    disabled
                    v-if="!hasSelectedWords"
                    style="opacity: 1; background: transparent; border-color: transparent"
                    class="btn btn-light">
              Check to move</button>
            <select class="combobox form-control"
                    v-if="hasSelectedWords"
                    v-model="word.newFolderId">
              <option v-for="folder in folders"
                      :key="folder._id"
                      :value="folder._id"> {{folder.name}}</option>
            </select>
            <div class="input-group-append">
              <button type="button"
                      v-if="hasSelectedWords"
                      @click="moveWords()"
                      class="btn btn-outline-success">Move selected</button>
              <button type="button"
                      class="btn btn-outline-success"
                      @click="setAllWords(true)"
                      v-if="!isAllSelected">Select all</button>
              <button type="button"
                      class="btn btn-outline-success"
                      @click="setAllWords(false)"
                      v-if="!isAllUnSelected">Unselect all</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row"
         v-if="isLoading">
      <div class="col-sm-nopadding">
        <div class="progress margin-top">
          <div class="progress-bar progress-bar-striped progress-bar-animated"
               role="progressbar"
               aria-valuenow="100"
               aria-valuemin="0"
               aria-valuemax="100"
               style="width: 100%" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-nopadding">
        <app-virtualScrollList id="wordScroller"
                               v-show="!isLoading"
                               class="list-group marginagble">

          <div class="list-group-item flex-column align-items-start d-flex w-100 justify-content-between"
               v-for="word in filteredWords"
               :key="word._id">
            <div class="container nopadding"
                 :width="word.full.width"
                 :height="word.full.height">
              <div class="row">

                <div class="col">

                  <div class="p-2 custom-control custom-checkbox">
                    <input type="checkbox"
                           :id="word._id"
                           v-model="word.isChecked"
                           class="custom-control-input">
                    <label class="custom-control-label"
                           :for="word._id">
                      {{word.originalWord}} | {{word.pronunciation.replace(/\|/g," ")}} | {{word.translation}}
                    </label>
                  </div>
                  <div class="p-2">{{scoreToString(word.score)}}</div>
                  <div class="p-2">{{word.usage}}</div>
                </div>
                <div class="col">
                  <img :src="getFileIdPath(word.full.id)"
                       :height="word.full.height"
                       :width="word.full.width" />
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
import * as JsSearch from "js-search";
import VirtualScrollList from "./framework/VirtualScrollList.vue";
import { isNullOrUndefined } from "util";
import { route, routes } from "../services/routeService";
import { scoreToString } from "../services/convertService";
import folder from "../store/folder";

@Component({
  components: {
    "app-virtualScrollList": VirtualScrollList
  }
})
export default class Word extends Vue {
  constructor() {
    super();
    this.search = new JsSearch.Search("_id");
    this.search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
    this.search.addIndex("originalWord");
    this.search.addIndex("translation");
  }
  @State word: I.IWordState;
  @State folder: I.IFolderState;
  search: JsSearch.Search;
  @Provide() SearchText = "";

  counter = 0;

  getFileIdPath(idFile: string) {
    return route(routes._word_file__fileId_, idFile);
  }
  scoreToString(score: I.IScore) {
    return scoreToString(score);
  }

  mounted() {
    this.resize();
    this.scroll();
    window.addEventListener("resize", this.resize);

    const scroller = this.getScroller();
    if (!isNullOrUndefined(scroller)) {
      scroller.addEventListener("scroll", this.scroll);
    }

    const idFolder = this.currentFolderId;
    this.store.commit(word.mutations.setFolder)(this.$store, idFolder);
    this.folderStore.dispatch(folder.actions.fetchFolders)(this.$store);
    this.store
      .dispatch(word.actions.fetchWords)(this.$store, idFolder)
      .then(a => {
        this.search.addDocuments(this.words);
      });
  }
  destroyed() {
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("scroll", this.scroll);

    const scroller = this.getScroller();
    if (!isNullOrUndefined(scroller)) {
      scroller.removeEventListener("scroll", this.scroll);
    }
  }

  get store() {
    return getStoreAccessors<I.IWordState, ST.IRootState>(ST.Modules.word);
  }

  get folderStore() {
    return getStoreAccessors<I.IFolderState, ST.IRootState>(ST.Modules.folder);
  }

  get words() {
    return this.store.read(word.getters.getWords)(this.$store);
  }
  get hasSelectedWords() {
    return this.store.read(word.getters.hasSelectedWords)(this.$store);
  }
  get isAllSelected() {
    return this.store.read(word.getters.isAllSelected)(this.$store);
  }
  get isAllUnSelected() {
    return this.store.read(word.getters.isAllUnSelected)(this.$store);
  }
  get isLoading() {
    return this.store.read(word.getters.isLoading)(this.$store);
  }
  get folders() {
    return this.folderStore.read(folder.getters.getFolders)(this.$store);
  }
  get filteredWords() {
    return this.SearchText == ""
      ? this.words
      : this.search.search(this.SearchText);
  }
  get currentFolderId() {
    return +this.$route.params.id;
  }
  get currentFolderName() {
    return this.folders
      .filter(a => a._id === this.currentFolderId)
      .map(a => a.name)[0];
  }

  setAllWords(state: boolean) {
    this.store.commit(word.mutations.setAllWords)(this.$store, state);
  }

  moveWords() {
    this.store.dispatch(word.actions.moveWords)(this.$store);
  }

  scroll() {
    const scroller = this.getScroller();
    if (isNullOrUndefined(scroller)) return;

    const top = scroller.scrollTop;
    if (top > 50) {
      this.hideHeader();
    } else {
      this.showHeader();
    }
    this.resize();
  }

  hideHeader() {
    document.getElementsByTagName("header")[0].style.display = "none";
  }
  showHeader() {
    document.getElementsByTagName("header")[0].style.display = "block";
  }

  getScroller() {
    return document.getElementById("wordScroller");
  }

  resize() {
    const scroller = this.getScroller();
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

button:disabled {
  border-color: #28a745;
}
</style>
