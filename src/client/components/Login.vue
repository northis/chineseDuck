<template>
  <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column container">
    <header class="masthead mb-auto" />
    <div class="form-signin inner cover text-center">
      <img class="mb-4"
           src="../assets/favicon/logo.svg"
           alt=""
           width="72"
           height="72">
      <div class="text-center marginagble">
        Click the button to log in. If there is no button below, then Telegram is blocked and you should use Login button in the bot itself.
      </div>
      <telegram-login />
    </div>

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
import { Emit, Provide } from "vue-property-decorator";
import { EAuthStage } from "../types/enums";
import * as ST from "../store/types";
import { getStoreAccessors } from "vuex-typescript";
import auth from "../store/auth";
import { getFooterMarkup, Settings } from "../../../config/common";
import TelegramLogin from "./framework/TelegramLogin.vue";

@Component({
  components: {
    "telegram-login": TelegramLogin
  }
})
export default class Login extends Vue {
  @State auth: T.IAuthState;
  @Provide() Footer = getFooterMarkup();

  mounted() {
    console.log("Login mounted");
  }

  created() {}

  get store() {
    return getStoreAccessors<T.IAuthState, ST.IRootState>(ST.Modules.auth);
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
$mControlWidth: 400px;
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