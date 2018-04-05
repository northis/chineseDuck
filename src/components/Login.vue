<template>
  <div class="gridCenter">
    <div class="loginBox">
      <h2>Login</h2>
      <p>Please type your Telegram-bound phone number</p>
    </div>
    <!-- <p v-if="$route.query.redirect">
      Nope, your number first, please.
    </p>
    <form @submit.prevent="login">
      <label><input v-model="email" type="tel" name="phone"  placeholder="+ (XXX) XXX-XXXX" pattern="\(\d{3}\) \d{3}\-\d{4}" class="masked" title="10-digit number"  @keyup.enter="login"></label>
      <button type="submit">login</button>
      <p v-if="error" class="error">Bad login information</p>
    </form> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { State, Action, Getter } from "vuex-class";
import Component from "vue-class-component";
import * as T from "../store/auth/types";

@Component
export default class Login extends Vue {
  @State auth: T.IAuthState;

  mounted() {
    console.log("Login mounted");

    console.log(this.auth);
    //this.fetchData();
  }
  created() {}
}
</script>

<style lang="scss">
@import "../assets/styles/mainStyles.scss";

.loginBox {
  border: 1px solid black;
  grid-column: 2;
  grid-row: 2;
  padding: 1rem;
  min-width: 30rem;
  min-height: 30rem;
}

.gridCenter {
   @extend .fullSize;
  justify-items: center;
  align-items:   center;
  display: grid;
  grid-template-rows:  repeat(3, 1fr);
  grid-template-columns:  repeat(3, 1fr);
}

.error {
  color: red;
}
</style>