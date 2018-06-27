<template>
  <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column container">
    <header class="masthead mb-auto" />
    <form class="form-signin inner cover text-center"
          action="/"
          @submit.prevent="submit"
          method="post"
          novalidate>
      <img class="mb-4"
           src="../assets/favicon/logo.svg"
           alt=""
           width="72"
           height="72">

      <template v-if="auth.stage == 0">
        <p class="text-left">Please type your Telegram-bound phone number</p>
        <div class="form-group">
          <app-comboBox :useFullList="true"
                        @selectedChanged="selectedChanged"
                        autofocus
                        @blur.once="VM.FirstFocusCountry = false"
                        v-bind:class="{ 'is-invalid': VM.CurrentMask=='' && !VM.FirstFocusCountry }">
            <option v-for="item in mainCountries"
                    :key="item.n"
                    :value="item.m"> {{item.n}}</option>
            <option slot="FullList"
                    v-for="item in otherCountries"
                    :key="item.n"
                    :value="item.m"> {{item.n}}</option>
            <span slot="Header">Select your country </span>
          </app-comboBox>
        </div>

        <div class="form-group">
          <input type="tel"
                 id="inputPhone"
                 class="form-control"
                 @blur="VM.FirstFocusPhone = false"
                 @invalid="VM.IsPhoneReady = false"
                 @focus="VM.IsPhoneReady = true"
                 v-mask="VM.CurrentMask"
                 v-model="VM.UserTel"
                 v-bind:class="{ 'is-invalid': isPhoneInvalid }" />
          <div class="invalid-feedback">
            Invalid phone number.
          </div>
        </div>

        <app-checkBox class="mb-3 text-left"
                      @checkedChanged="saveAuthChanged">Remember me</app-checkBox>

        <div class="mb-3 text-left errorText"
             v-if="VM.CommonError != ''">
          {{VM.CommonError}}
        </div>
        <button class="btn-block"
                type="submit">Request code</button>
      </template>

      <div class="form-group"
           v-if="auth.stage == 1">
        Requesting code for the phone number...
      </div>

      <template v-if="auth.stage == 2">
        <p class="text-left">Please type a code from the message you've just received.</p>
        <div class="form-group">
          <input type="tel"
                 id="inputCode"
                 class="form-control"
                 @blur.once="VM.FirstFocusCode = false"
                 @invalid="VM.IsCodeReady = false"
                 @focus="VM.IsCodeReady = true"
                 v-mask="'99999'"
                 v-model="VM.UserCode"
                 v-bind:class="{ 'is-invalid': !VM.FirstFocusCode && !VM.IsCodeReady }" />
          <div class="invalid-feedback">Invalid code.</div>
        </div>

        <button class="btn-block"
                type="submit">Send code</button>
      </template>

      <div class="form-group"
           v-if="auth.stage == 3">
        Sending the code...
      </div>
    </form>

    <footer class="mastfoot mt-auto text-center"
            v-html="Footer">
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";
import * as T from "../types/interfaces";
import * as E from "../types/enums";
import CheckBox from "./framework/CheckBox.vue";
import ComboBox from "./framework/ComboBox.vue";
import { Emit, Provide } from "vue-property-decorator";
import { EAuthStage } from "../types/enums";
import { LoginVM } from "./viewModels/loginVM";
import * as ST from "../store/types";
import { getStoreAccessors } from "vuex-typescript";
import auth from "../store/auth";
import { getFooterMarkup } from "../../../config/common";

const mask = require("./directives/mask").default;
Vue.use(mask);

@Component({
  components: {
    "app-checkBox": CheckBox,
    "app-comboBox": ComboBox
  }
})
export default class Login extends Vue {
  @State auth: T.IAuthState;
  @Provide() VM = new LoginVM();
  @Provide() Footer = getFooterMarkup();

  @Emit()
  submit(e: Event) {
    this.setError(null);
    switch (this.auth.stage) {
      case E.EAuthStage.NoAuth:
        e.preventDefault();
        this.VM.UserCode = "";

        if (!this.VM.IsPhoneReady) {
          return;
        }

        this.store
          .dispatch(auth.actions.sendPhoneNumber)(this.$store, this.VM.UserTel)
          .then(
            ((st: E.EAuthStage) => {
              setTimeout((() => this.setFocus("inputCode")).bind(this), 0);
            }).bind(this)
          )
          .catch(e => this.setError.bind(this, e)());
        break;

      case E.EAuthStage.PhoneOk:
        if (!this.VM.IsCodeReady) {
          e.preventDefault();
          return;
        }

        this.store
          .dispatch(auth.actions.sendCode)(this.$store, this.VM.UserCode)
          .then(
            ((st: T.IUser) => {
              const userExists = st != null;
              if (userExists) {
                const form = <HTMLFormElement>e.target;
                if (form != null) {
                  window.location.href = form.action;
                }
              } else {
                e.preventDefault();
              }
            }).bind(this)
          )
          .catch((() => (this.VM.IsCodeReady = false)).bind(this));
        break;

      default:
        e.preventDefault();
        break;
    }
  }

  setError(e: Error | null) {
    if (e == null) this.VM.CommonError = "";
    else {
      this.VM.CommonError = e.message;
      this.restoreVM();
    }
  }

  restoreVM() {
    this.VM.UserTel = "";
    this.VM.IsPhoneReady = this.VM.IsCodeReady = false;
    this.VM.FirstFocusPhone = this.VM.FirstFocusCode = true;
  }

  setFocus(itemName: string) {
    const item = document.getElementById(itemName);
    if (item != null) item.focus();
  }

  mounted() {
    console.log("Login mounted");
    //this.store.dispatch(auth.actions.fetchUser)(this.$store);
  }

  created() {
    this.VM.telMasks = this.store.read(auth.getters.getTelMasks)(this.$store);
  }

  get store() {
    return getStoreAccessors<T.IAuthState, ST.IRootState>(ST.Modules.auth);
  }

  get mainCountries() {
    const masks = this.VM.telMasks;
    return masks === null ? null : masks.mainCountriesMasks;
  }
  get otherCountries() {
    const masks = this.VM.telMasks;
    return masks === null ? null : masks.otherCountriesMasks;
  }

  get isPhoneInvalid() {
    return (
      !this.VM.FirstFocusPhone &&
      (!this.VM.IsPhoneReady || this.VM.CurrentMask == "")
    );
  }

  @Emit()
  selectedChanged(value: string) {
    this.VM.CurrentMask = value;
    if (value != "") this.setFocus("inputPhone");
  }

  @Emit()
  saveAuthChanged(value: boolean) {
    this.store.commit(auth.mutations.setSaveAuth)(this.$store, value);
    this.VM.SaveAuth = value;
  }
}
</script>

<style lang="scss">
html,
body {
  justify-content: center;
}
</style>
<style lang="scss" scoped>
@import "../assets/styles/mainStyles.scss";
$mControlWidth: 330px;
$sBorderWidth: 15px;
$xsBorderWidth: 10px;
$mBorderWidth: 25px;

.form-signin {
  max-width: $mControlWidth;
  padding: $xsBorderWidth;
  margin: 0 auto;

  .form-control {
    position: relative;
    box-sizing: border-box;
    height: auto;
  }
  .form-control:focus {
    z-index: 1;
  }
}
</style>