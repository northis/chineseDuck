<template>
  <div class="text-center">
    <form class="form-signin" @submit.prevent="login">
      <img class="mb-4" src="../assets/favicon/logo.svg" alt="" width="72" height="72">
      <p>Please type your Telegram-bound phone number</p>
      <select id="inputState" class="form-control">
        <option selected v-for="item in items" :key="item.id">{{item.n}}.</option>
        <option disabled>──────────</option>
      </select>
      <input type="tel" class="form-control" v-mask="'(+\\971-59-999-9999)|(+\\971-#-###-####)'" required autofocus>

      <app-checkBox class="mb-3 text-left" Message="Remember me 🇨🇳" v-bind:IsChecked=false></app-checkBox>
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
const VueInputMask = require("vue-inputmask").default;

Vue.use(VueInputMask);
@Component({
  components: {
    "app-checkBox": CheckBox
  }
})
export default class Login extends Vue {
  @State auth: T.IAuthState;

  mounted() {
    console.log("Login mounted");

    console.log(this.auth);
    //this.fetchData();
  }

  // get countryMasks(){

  // }

  created() {}
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
    padding: $xsBorderWidth;
  }
  .form-control:focus {
    z-index: 1;
  }

  input[type="tel"] {
    margin-bottom: $mBorderWidth;
  }
}

.error {
  color: red;
}
</style>