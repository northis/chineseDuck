<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-nopadding">
        <div class="margin-top">
          <div class="input-group">
            <div class="input-group-prepend">
              <button class="btn" type="button" :disabled="IsInEditMode">Add new</button>
            </div><input type="text" class="form-control" v-model="SearchText" :disabled="IsInEditMode" placeholder="Find folder..."></div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-nopadding">
        <ul class="list-group marginagble">
          <li class="list-group-item d-flex justify-content-between align-items-center listItemPadding" v-for="folder in filteredFolders" :key="folder._id">
            <div v-html="highlightKeyword(folder.name) + ` (0)`" v-if="!IsInEditMode"></div>
            <div v-if="IsInEditMode && folder._id == currentFolder._id">
              <input v-validate="{ regex: validation.folder.name.regex }" name="folderName" type="text" v-model="folder.name">
              <span v-show="errors.has('folderName')">{{ validation.folder.name.message }}</span>
            </div>
            <div class="float-right">
              <button type="button" class="btn btn-light" :disabled="IsInEditMode"><img src="../assets/images/pencil.svg" class="align-middle" @click="editFolder(folder)" /></button>
              <button type="button" class="btn btn-light" data-toggle="modal" data-target="#deleteConfirmWindow" :disabled="IsInEditMode"><img src="../assets/images/trashcan.svg" @click="deleteFolder(folder)" class="align-middle" /></button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <app-confirmWindow id="deleteConfirmWindow" @confirmed="deleteCurrentFolder">
      <div slot="Header">
        Folder delete confirmation
      </div>
      <div slot="Content">
        Are you sure you want to delete folder "{{currentFolder.name}}"?
      </div>
    </app-confirmWindow>
  </div>

</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State } from "vuex-class";
import * as T from "../types/interfaces";
import * as ST from "../store/types";
import { Provide, Emit } from "vue-property-decorator";
import { getStoreAccessors } from "vuex-typescript";
import folder from "../store/folder";
import { isNullOrUndefined } from "util";
import * as JsSearch from "js-search";
import ConfirmWindow from "./framework/ConfirmWindow.vue";
import * as validation from "../../shared/validation";

@Component({
  components: {
    "app-confirmWindow": ConfirmWindow
  }
})
export default class Folder extends Vue {
  constructor() {
    super();
    this.search = new JsSearch.Search("_id");
    this.search.indexStrategy = new JsSearch.PrefixIndexStrategy();
    this.highlighter = new JsSearch.TokenHighlighter(
      this.search.indexStrategy,
      this.search.sanitizer,
      'span class="highlight"'
    );
    this.search.addIndex("name");
  }

  @State folder: T.IFolderState;
  @Provide() SearchText = "";
  @Provide() IsInEditMode = false;
  @Provide() IsInDeleteMode = false;
  @Provide() IsConfirmed = false;

  search: JsSearch.Search;
  highlighter: JsSearch.TokenHighlighter;

  mounted() {
    this.store
      .dispatch(folder.actions.fetchFolders)(this.$store)
      .then(a => {
        this.search.addDocuments(this.folders);
      });
  }

  get store() {
    return getStoreAccessors<T.IFolderState, ST.IRootState>(ST.Modules.folder);
  }
  get filteredFolders() {
    return this.SearchText == ""
      ? this.folders
      : this.search.search(this.SearchText);
  }
  get folders() {
    return this.store.read(folder.getters.getFolders)(this.$store);
  }
  get currentFolder() {
    return this.store.read(folder.getters.getCurrentFolder)(this.$store);
  }

  @Emit()
  editFolder(folderItem: T.IFolder) {
    this.setEditMode(folderItem);
  }

  @Emit()
  deleteFolder(folderItem: T.IFolder) {
    this.setEditMode(folderItem);
  }

  setEditMode(folderItem: T.IFolder) {
    this.IsInEditMode = true;
    this.store.commit(folder.mutations.setCurrentFolder)(
      this.$store,
      folderItem
    );
  }

  deleteCurrentFolder() {
    this.store
      .dispatch(folder.actions.deleteFolder)(this.$store)
      .then(a => {})
      .catch(a => {});
  }

  highlightKeyword(str: string) {
    return this.SearchText == ""
      ? str
      : this.highlighter.highlight(str, [this.SearchText]);
  }
  created() {}
}
</script>
<style lang="scss" scoped>
@import "../assets/styles/mainStyles.scss";
.marginagble {
  margin: $mainMargin;
}

.margin-top {
  @extend .marginagble;
  margin-bottom: 0;
}

.col-sm-nopadding {
  @extend .col-sm;
  padding: 0;
}

.highlight {
  background-color: $mainColor;
}

.listItemPadding {
  padding: 0.5em 1em 0.5em 1em;
}
</style>