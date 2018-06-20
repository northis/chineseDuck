<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-nopadding">
        <div class="margin-top">
          <div class="input-group">
            <div class="input-group-prepend">
              <button class="btn"
                      type="button"
                      :disabled="isNoEdit">Add new</button>
            </div>
            <input type="text"
                   class="form-control"
                   v-model="SearchText"
                   :disabled="isNoEdit"
                   placeholder="Find folder..."></div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-nopadding">
        <div class="marginagble">
          <div class="list-group">
            <div class="list-group-item list-group-item-action flex-column align-items-start d-flex w-100 justify-content-between"
                 v-for="folder in filteredFolders"
                 :key="folder._id">
              <div class="container nopadding">
                <div class="row">
                  <div class="col nopadding">
                    <div v-html="highlightKeyword(folder.name) + ` (0)`"
                         v-if="!IsInEditMode || folder._id != currentFolder._id" />
                    <div v-else>

                      <div class="input-group">
                        <div class="input-group-prepend">
                          <button class="btn"
                                  @click="saveFolder()">
                            <img src="../assets/images/save.svg"
                                 class="align-middle" />
                          </button>
                          <button class="btn"
                                  @click="cancelEdit()">
                            <img src="../assets/images/x.svg"
                                 class="align-middle" />
                          </button>
                        </div>

                        <input v-validate="{ required: true, regex: validation.folder.name.regex }"
                               :class="{'form-control': true, 'is-invalid': errors.has('folderName') }"
                               name="folderName"
                               type="text"
                               v-model="folder.name">
                        <div class="invalid-feedback">
                          {{ validation.folder.name.message }}
                        </div>
                      </div>

                    </div>
                    <small>
                      {{timeagoInstance.format(folder.createDate)}}
                    </small>
                  </div>
                  <div class="col-md-auto nopadding">
                    <button type="button"
                            class="btn btn-light"
                            :disabled="isNoEdit"
                            @click="editFolder(folder)">
                      <img src="../assets/images/edit.svg"
                           class="align-middle" />
                    </button>
                    <button type="button"
                            class="btn btn-light"
                            data-toggle="modal"
                            :disabled="isNoEdit"
                            @click="deleteFolder(folder)"
                            data-target="#deleteConfirmWindow">
                      <img src="../assets/images/trash.svg"
                           class="align-middle" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-confirmWindow id="deleteConfirmWindow"
                       @confirmed="deleteCurrentFolder">
      <div slot="Header">
        Folder delete confirmation
      </div>
      <div slot="Content">
        Are you sure you want to delete folder "{{currentFolder ? currentFolder.name: ""}}"?
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
import { isNullOrUndefined, isNull } from "util";
import * as JsSearch from "js-search";
import ConfirmWindow from "./framework/ConfirmWindow.vue";
import * as validation from "../../shared/validation";
import timeago from "timeago.js";

@Component({
  components: {
    "app-confirmWindow": ConfirmWindow
  }
})
export default class Folder extends Vue {
  constructor() {
    super();
    this.search = new JsSearch.Search("_id");
    this.search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
    this.search.addIndex("name");
  }

  @State folder: T.IFolderState;
  @Provide() SearchText = "";
  @Provide() IsInEditMode = false;
  @Provide() IsInDeleteMode = false;
  @Provide() IsConfirmed = false;
  @Provide() IsLoading = false;
  @Provide() validation = validation;
  @Provide() timeagoInstance = timeago();

  editUndo = {
    folderName: ""
  };
  search: JsSearch.Search;

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
  get isNoEdit() {
    return this.IsInEditMode || this.IsLoading;
  }

  @Emit()
  editFolder(folderItem: T.IFolder) {
    this.IsInEditMode = true;
    this.setCurrentFolder(folderItem);
    this.editUndo.folderName = folderItem.name;
  }

  @Emit()
  deleteFolder(folderItem: T.IFolder) {
    this.setCurrentFolder(folderItem);
  }

  setCurrentFolder(folderItem: T.IFolder | null) {
    this.store.commit(folder.mutations.setCurrentFolder)(
      this.$store,
      folderItem
    );
  }

  cancelEdit() {
    this.IsInEditMode = false;
    if (!isNull(this.currentFolder)) {
      this.currentFolder.name = this.editUndo.folderName;
      this.setCurrentFolder(null);
    }
    this.editUndo.folderName = "";
  }

  saveFolder() {
    this.IsLoading = true;

    this.IsInEditMode = false;
  }

  deleteCurrentFolder() {
    this.IsLoading = true;
    this.store
      .dispatch(folder.actions.deleteFolder)(this.$store)
      .then(a => {
        this.IsLoading = false;
      })
      .catch(a => {
        this.IsLoading = false;
      });
  }

  highlightKeyword(str: string) {
    if (this.SearchText != "") {
      var highlight = [
        this.SearchText.trim(),
        this.SearchText.toLowerCase().trim()
      ];
      str = " " + str;
      return str.replace(
        new RegExp("(.)(" + highlight.join("|") + ")(.)", "i"),
        '$1<span style="background-color:yellow">$2</span>$3'
      );
    } else return str;
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
.nopadding {
  padding: 0;
}
.nomargin {
  margin: 0;
}
.col-sm-nopadding {
  @extend .col-sm;
  @extend .nopadding;
}

.highlightSearch {
  background-color: $mainColor;
}

.listItemPadding {
  padding: 0.5em 1em 0.5em 1em;
}
</style>