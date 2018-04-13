<template>
  <div class="text-center">
    <form class="form-signin" action="/" @submit.prevent="submit" method="post" novalidate>
      <img class="mb-4" src="../assets/favicon/logo.svg" alt="" width="72" height="72">

      <template v-if="auth.stage == 0">
        <p class="text-left">Please type your Telegram-bound phone number</p>
        <div class="form-group">
          <app-comboBox :useFullList="true" @selectedChanged="selectedChanged" autofocus @blur.once="VM.FirstFocusCountry = false" v-bind:class="{ 'is-invalid': VM.CurrentMask=='' && !VM.FirstFocusCountry }">
            <option v-for="item in mainCountries" :key="item.n" :value="item.m"> {{item.n}}</option>
            <option slot="FullList" v-for="item in otherCountries" :key="item.n" :value="item.m"> {{item.n}}</option>
            <span slot="Header">Select your country </span>
          </app-comboBox>
        </div>

        <div class="form-group">
          <input type="tel" id="inputPhone" class="form-control" @blur.once="VM.FirstFocusPhone = false" @invalid="VM.IsPhoneReady = false" @focus="VM.IsPhoneReady = true" v-mask="VM.CurrentMask" v-model="VM.UserTel" v-bind:class="{ 'is-invalid': isPhoneInvalid }" />
          <div class="invalid-feedback">Invalid phone number.</div>
        </div>

        <app-checkBox class="mb-3 text-left" @checkedChanged="saveAuthChanged">Remember me</app-checkBox>
        <button class="btn-block" type="submit">Send SMS</button>
      </template>

      <div class="form-group" v-if="auth.stage == 1">
        Sending the phone number...
      </div>

      <template v-if="auth.stage == 2">
        <p class="text-left">Please type a code from the SMS you've just received.</p>
        <div class="form-group">
          <input type="tel" id="inputCode" class="form-control" @blur.once="VM.FirstFocusCode = false" @invalid="VM.IsCodeReady = false" @focus="VM.IsCodeReady = true" v-mask="'9999'" v-model="VM.UserCode" v-bind:class="{ 'is-invalid': !VM.FirstFocusCode && !VM.IsCodeReady }" />
          <div class="invalid-feedback">Invalid code.</div>
        </div>

        <button class="btn-block" type="submit">Send code</button>
      </template>

      <div class="form-group" v-if="auth.stage == 3">
        Sending the code...
      </div>

      <div class="invalid-feedback" v-bind:class="{ 'is-invalid': VM.CommonError!='' }">
        {{VM.CommonError}}
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { State, Action, Getter } from "vuex-class";
import Component from "vue-class-component";
import * as T from "../types/interfaces";
import * as E from "../types/enums";
import CheckBox from "./framework/CheckBox.vue";
import ComboBox from "./framework/ComboBox.vue";
import { Emit, Provide } from "vue-property-decorator";
import { EAuthStage } from "../types/enums";
import { triggerAsyncId } from "async_hooks";
import { LoginVM } from "./viewModels/loginVM";

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

  @Emit()
  submit(e: Event) {
    this.setError(null);

    switch (this.auth.stage) {
      case E.EAuthStage.NoAuth:
        e.preventDefault();

        if (!this.VM.IsPhoneReady) {
          return;
        }

        this.auth.authService
          .SendPhoneNumber(this.VM.UserTel)
          .then(
            ((st: E.EAuthStage) => {
              this.updateStage(st);
              setTimeout((() => this.setFocus("inputCode")).bind(this), 0);
            }).bind(this)
          )
          .catch(this.setError.bind(this));
        this.auth.stage = E.EAuthStage.PhoneSent;
        break;

      case E.EAuthStage.PhoneOk:
        if (!this.VM.IsCodeReady) {
          e.preventDefault();
          return;
        }

        this.auth.authService
          .SendCode(this.VM.UserCode)
          .then(
            ((st: E.EAuthStage) => {
              this.updateStage(st);

              if (st != E.EAuthStage.Auth) {
                e.preventDefault();
              } else {
                const form = <HTMLFormElement>e.target;
                if (form != null) {
                  this.$router.push(form.action);}
              }
            }).bind(this)
          )
          .catch(this.setError.bind(this));
        this.auth.stage = E.EAuthStage.CodeSent;
        break;

      default:
        e.preventDefault();
        break;
    }
  }

  updateStage(st: E.EAuthStage) {
    this.auth.stage = st;
  }
  setError(error: Error | null) {
    if (error == null) this.VM.CommonError = "";
    else this.VM.CommonError = error.message;
  }

  setFocus(itemName: string) {
    const item = document.getElementById(itemName);
    if (item != null) item.focus();
  }

  mounted() {
    console.log("Login mounted");
  }

  get mainCountries() {
    return this.auth.phoneMaskService.GetMainCountries();
  }
  get otherCountries() {
    return this.auth.phoneMaskService.GetOtherCountries();
  }

  get isPhoneInvalid() {
    return (
      !this.VM.FirstFocusPhone &&
      (!this.VM.IsPhoneReady || this.VM.CurrentMask == "")
    );
  }

  created() {}

  @Emit()
  selectedChanged(value: string) {
    this.VM.CurrentMask = value;

    if (value != "") this.setFocus("inputPhone");
  }

  @Emit()
  saveAuthChanged(value: boolean) {
    this.VM.SaveAuth = value;
  }
}
</script>

<style lang="scss">
@import "../assets/styles/mainStyles.scss";
$mControlWidth: 330px;
$sBorderWidth: 15px;
$xsBorderWidth: 10px;
$mBorderWidth: 25px;

html,
body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-signin {
  width: 100%;
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

  // input[type="tel"] {
  //   margin-top: $mBorderWidth;
  //   margin-bottom: $mBorderWidth;
  // }
}

.error {
  color: red;
}
</style>