<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-nopadding">
        <div class="margin-top">
          <div class="input-group">
            <input type="text"
                   class="form-control"
                   placeholder="Find words...">
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
      </div>

      <div class="col-auto nopadding">
        <div class="margin-top">
          <div class="input-group">
            <select class="combobox form-control"
                    :disabled="!hasSelectedWords"
                    @selectedChanged="selectedChanged">
              <option disabled
                      selected
                      hidden
                      value="">
                <span>Select a folder to move words </span>
              </option>
              <option v-for="folder in folders"
                      :key="folder._id"
                      :value="folder._id"> {{folder.name}}</option>
            </select>
            <div class="input-group-append">
              <button type="button"
                      :disabled="!hasSelectedWords"
                      class="btn btn-outline-success">Move selected</button>
              <button type="button"
                      class="btn btn-outline-success"
                      :disabled="isAllSelected">Select all</button>
              <button type="button"
                      class="btn btn-outline-success"
                      :disabled="isAllUnSelected">Unselect all</button>
            </div>

            <!-- <button type="button"
                        data-toggle="tooltip"
                        title="Go to the words in this folder"
                        class="btn btn-outline-primary darkColor"
                        v-show="!isNoEdit" 
               v-if=""
                        @click="goToWords(folder)">
                  To words
                  <img src="../assets/images/arrow-right-circle.svg"
                       class="align-middle" />
                </button>
                <button type="button"
                        v-if="folder._id != userFolder"
                        data-toggle="tooltip"
                        title="Set current learning folder"
                        class="btn btn-outline-success"
                        v-show="!isNoEdit"
                        @click="setUserCurrent(folder)">
                  <img src="../assets/images/flag.svg"
                       class="align-middle" />
                </button>
                <button type="button"
                        data-toggle="tooltip"
                        title="Rename the folder"
                        class="btn btn-outline-secondary"
                        v-show="!(folder && folder._id == 0) && !isNoEdit"
                        @click="editFolder(folder)">
                  <img src="../assets/images/italic.svg"
                       class="align-middle" />
                </button> -->
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-nopadding">
        <div class="progress marginagble"
             v-if="isLoading">
          <div class="progress-bar progress-bar-striped progress-bar-animated"
               role="progressbar"
               aria-valuenow="100"
               aria-valuemin="0"
               aria-valuemax="100"
               style="width: 100%" />
        </div>
        <app-virtualScrollList id="wordScroller"
                               class="list-group marginagble">
          <div class="list-group-item flex-column align-items-start d-flex w-100 justify-content-between"
               v-for="word in words"
               :key="word._id">
            <div class="container nopadding"
                 :width="word.full.width"
                 :height="word.full.height">
              <div class="row">
                <div class="col-md-auto">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox"
                           :id="word._id"
                           v-model="word.isChecked"
                           class="custom-control-input">
                    <label class="custom-control-label"
                           :for="word._id">
                    </label>
                  </div>
                </div>
                <div class="col">
                  <img :src="getFileIdPath(word.full.id)"
                       :height="word.full.height"
                       :width="word.full.width" />
                </div>

                <div class="col">
                  <div class="d-flex flex-column mb-3">
                    <div class="p-2">{{word.originalWord}} | {{word.pronunciation.replace(/\|/g," ")}} | {{word.translation}}</div>
                    <div class="p-2">{{scoreToString(word.score)}}</div>
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
import { scoreToString } from "../services/convertService";
import folder from "../store/folder";

@Component({
  components: {
    "app-virtualScrollList": VirtualScrollList
  }
})
export default class Word extends Vue {
  @State word: I.IWordState;
  @State folder: I.IFolderState;

  counter = 0;

  getFileIdPath(idFile: string) {
    return route(routes._word_file__fileId_, idFile);
  }
  scoreToString(score: I.IScore) {
    return scoreToString(score);
  }

  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize);

    const idFolder = +this.$route.params.id;
    this.folderStore.dispatch(folder.actions.fetchFolders)(this.$store);
    this.store.dispatch(word.actions.fetchWords)(this.$store, idFolder);
  }
  destroyed() {
    window.removeEventListener("resize", this.resize);
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

  @Emit()
  wordCheck(value: boolean) {}

  @Emit()
  selectedChanged(value: number) {
    console.log("folder" + value);
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/mainStyles.scss";

button:disabled {
  border-color: #28a745;
}
</style>
