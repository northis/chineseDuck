<template>
  <div class="text-center">
    <form class="form-signin" @submit.prevent="login">
      <img class="mb-4" src="../assets/favicon/logo.svg" alt="" width="72" height="72">
      <p>Please type your Telegram-bound phone number</p>

      <app-comboBox :useFullList="true" @selectedChanged="selectedChanged">
        <option v-for="item in mainCountries" :key="item.n" :value="item.m"> {{item.n}}</option>
        <option slot="FullList" v-for="item in otherCountries" :key="item.n" :value="item.m"> {{item.n}}</option>
        <span slot="Header">Select your country</span>
      </app-comboBox>

      <input type="tel" id="inputPhone" class="form-control" v-mask="CurrentMask" required autofocus data-inputmask-clearmaskonlostfocus="false" />
      <app-checkBox class="mb-3 text-left" Message="Remember me" v-bind:IsChecked=false></app-checkBox>
      <button class="btn-block" type="submit">Send me code</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { State, Action, Getter } from "vuex-class";
import Component from "vue-class-component";
import * as T from "../store/auth/types";
import CheckBox from "./framework/CheckBox.vue";
import ComboBox from "./framework/ComboBox.vue";

import { Emit, Provide } from "vue-property-decorator";

const inputmaskPlugin = require("./directives/vueInputMask").default;
Vue.use(inputmaskPlugin);

@Component({
  components: {
    "app-checkBox": CheckBox,
    "app-comboBox": ComboBox
  }
})
export default class Login extends Vue {
  @State auth: T.IAuthState;

  @Provide() CurrentMask = "";

  mounted() {
    console.log("Login mounted");
    //this.fetchData();"(+\\971-59-999-9999)|(+\\971-#-###-####)" ['+971-5#-###-####', '+971-#-###-####']
  }

  get mainCountries() {
    return this.auth.phoneMaskService.GetMainCountries();
  }
  get otherCountries() {
    return this.auth.phoneMaskService.GetOtherCountries();
  }

  created() {}

  @Emit()
  selectedChanged(value: string) {
    this.CurrentMask = value;
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

  input[type="tel"] {
    margin-top: $mBorderWidth;
    margin-bottom: $mBorderWidth;
  }
}

.error {
  color: red;
}
</style>