<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-nopadding">
        <div class="margin-top">
          <div class="input-group">
            <div class="input-group-prepend">
              <button class="btn"
                      type="button"
                      @click="startCreateFolder()"
                      :disabled="isNoEdit">Add new</button>
            </div>
            <input type="text"
                   class="form-control"
                   v-model="SearchText"
                   :disabled="isNoEdit"
                   placeholder="Find folder...">
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-nopadding">
        <div class="marginagble">
          <div class="progress margin-noside"
               v-show="IsLoading && !currentFolder">
            <div class="progress-bar progress-bar-striped progress-bar-animated"
                 role="progressbar"
                 aria-valuenow="100"
                 aria-valuemin="0"
                 aria-valuemax="100"
                 style="width: 100%" />
          </div>
          <div class="list-group">
            <div class="list-group-item flex-column align-items-start d-flex w-100 justify-content-between"
                 :class="{hoverable: !(folder._id == userFolder ||  folder._id == 0 || currentFolder && folder._id == currentFolder._id)}"
                 v-for="folder in filteredFolders"
                 :key="folder._id">
              <div class="container nopadding">
                <div class="row">
                  <div class="col">
                    <div v-html="highlightKeyword(folder.name) + ` (${folder.wordsCount})`"
                         v-if="!IsInEditMode || currentFolder && folder._id != currentFolder._id" />
                    <div v-else
                         class="input-group">

                      <div class="input-group-prepend">
                        <button class="btn"
                                :disabled="isInvalid || IsLoading"
                                data-toggle="tooltip"
                                title="Save the changes"
                                @click="saveFolder()">
                          <img src="../assets/images/save.svg"
                               class="align-middle" />
                        </button>
                        <button class="btn"
                                :disabled="IsLoading"
                                data-toggle="tooltip"
                                title="Discard the changes"
                                @click="cancelEdit()">
                          <img src="../assets/images/x.svg"
                               class="align-middle" />
                        </button>
                      </div>

                      <input v-validate="'required|FolderNameValidation'"
                             :class="{'form-control': true, 'is-invalid': isInvalid }"
                             name="folderName"
                             type="text"
                             v-model="folder.name" />
                    </div>
                    <div v-if="isInvalid && currentFolder && folder._id == currentFolder._id"
                         class="invalid">
                      {{ errors.first('folderName')}}
                    </div>
                    <div v-else>
                      <div class="progress margin-noside"
                           v-if="IsLoading && currentFolder && folder._id == currentFolder._id">
                        <div class="progress-bar progress-bar-striped progress-bar-animated"
                             role="progressbar"
                             aria-valuenow="100"
                             aria-valuemin="0"
                             aria-valuemax="100"
                             style="width: 100%" />
                      </div>
                      <small v-else>
                        {{timeagoInstance.format(folder.activityDate)}}
                        <span v-if="folder._id == 0"
                              class="badge badge-primary badge-pill">Default</span>
                        <span v-if="folder._id == userFolder"
                              class="badge badge-primary badge-pill">Current learning folder</span>
                      </small>
                    </div>
                  </div>
                  <div class="col-auto nopadding">
                    <button type="button"
                            data-toggle="tooltip"
                            title="Go to the words in this folder"
                            class="btn btn-outline-primary darkColor"
                            v-show="!isNoEdit"
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
                    </button>
                    <span data-toggle="tooltip"
                          title="Delete the folder">
                      <button type="button"
                              class="btn btn-outline-danger"
                              data-toggle="modal"
                              @click="startDeleteFolder(folder)"
                              v-show="!(folder && folder._id == 0) && !isNoEdit"
                              data-target="#deleteConfirmWindow">
                        <img src="../assets/images/trash.svg"
                             class="align-middle" />
                      </button>

                    </span>
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
import auth from "../store/auth";
import { isNullOrUndefined, isNull, isUndefined } from "util";
import * as JsSearch from "js-search";
import ConfirmWindow from "./framework/ConfirmWindow.vue";
import * as validation from "../../shared/validation";
import timeago from "timeago.js";
import { Validator } from "vee-validate";
import { formatError } from "../services/timeSavers";

const dictionary = {
  en: {
    attributes: {
      folderName: "folder name"
    }
  }
};

Validator.localize(dictionary);
Validator.extend("FolderNameValidation", {
  getMessage: (field: string) => validation.folder.name.message,
  validate: (value: string) => validation.folder.name.regex.test(value)
});

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
  @State auth: T.IAuthState;
  @Provide() SearchText = "";
  @Provide() IsInEditMode = false;
  @Provide() IsInDeleteMode = false;
  @Provide() IsConfirmed = false;
  @Provide() IsLoading = false;
  @Provide() timeagoInstance = timeago();

  saveItem = {
    oldFolderName: ""
  };
  search: JsSearch.Search;

  mounted() {
    this.IsLoading = true;
    this.store
      .dispatch(folder.actions.fetchFolders)(this.$store)
      .then(a => {
        this.IsLoading = false;
        this.search.addDocuments(this.folders);
      });
  }

  get store() {
    return getStoreAccessors<T.IFolderState, ST.IRootState>(ST.Modules.folder);
  }

  get userStore() {
    return getStoreAccessors<T.IAuthState, ST.IRootState>(ST.Modules.auth);
  }
  get filteredFolders() {
    return this.SearchText == ""
      ? this.folders
      : this.search.search(this.SearchText);
  }
  get folders() {
    return this.store.read(folder.getters.getFolders)(this.$store);
  }
  get isInvalid() {
    return this.$validator.errors.any();
  }
  get currentFolder() {
    return this.store.read(folder.getters.getCurrentFolder)(this.$store);
  }
  get isNoEdit() {
    return this.IsInEditMode || this.IsLoading;
  }

  get isAddMode() {
    return !isNull(this.currentFolder) && isUndefined(this.currentFolder._id);
  }

  get userFolder() {
    return this.auth.user ? this.auth.user.currentFolder_id : 0;
  }

  @Emit()
  editFolder(folderItem: T.IFolder) {
    this.IsInEditMode = true;
    this.setCurrentFolder(folderItem);
    this.saveItem.oldFolderName = folderItem.name;
  }

  @Emit()
  goToWords(folderItem: T.IFolder) {
    this.setCurrentFolder(folderItem);
    this.$router.push("folder/" + folderItem._id);
  }

  @Emit()
  startDeleteFolder(folderItem: T.IFolder) {
    this.setCurrentFolder(folderItem);
  }

  @Emit()
  startCreateFolder() {
    this.IsInEditMode = true;
    const folderItem: T.IFolder = {
      name: "New folder"
    };
    this.store.commit(folder.mutations.createFolder)(this.$store, folderItem);
    this.setCurrentFolder(folderItem);
  }

  @Emit()
  setUserCurrent(folderItem: T.IFolder) {
    this.IsLoading = true;
    this.setCurrentFolder(folderItem);
    this.userStore
      .dispatch(auth.actions.setUserCurrentFolder)(this.$store, folderItem)
      .then(a => {
        this.IsLoading = false;
      })
      .catch((e: any) => {
        this.IsLoading = false;
      });
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
      if (this.isAddMode) {
        this.store.commit(folder.mutations.deleteFolder)(
          this.$store,
          this.currentFolder
        );
      } else {
        this.currentFolder.name = this.saveItem.oldFolderName;
      }

      this.setCurrentFolder(null);
    }
    this.saveItem.oldFolderName = "";
  }

  saveFolder() {
    this.IsLoading = true;

    this.store
      .dispatch(
        this.isAddMode ? folder.actions.createFolder : folder.actions.saveFolder
      )(this.$store)
      .then(a => {
        this.IsInEditMode = false;
        this.IsLoading = false;
      })
      .catch((e: any) => {
        this.$validator.errors.add({
          field: "folderName",
          msg: formatError(e)
        });
        this.IsLoading = false;
      });
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

.margin-noside {
  @extend .marginagble;
  margin-left: 0;
  margin-right: 0;
}

.highlightSearch {
  background-color: $mainColor;
}

.listItemPadding {
  padding: 0.5em 1em 0.5em 1em;
}
.invalid {
  @extend .invalid-feedback;
  display: unset;
}

.semiOpacity {
  color: rgba(0, 0, 0, $mainSemiOpacity);
}

.hoverable {
  button {
    opacity: $mainSemiOpacity;
  }
  &:hover {
    button {
      opacity: 1;
    }
  }
}

.buttonIcons {
  @extend .align-middle;
  opacity: $mainSemiOpacity;
}
</style>