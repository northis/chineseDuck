<template>
  <div class="grid">
    <div class="login">
      <h2>Login</h2>
    </div>
    <!-- <p v-if="$route.query.redirect">
      You need to login first.
    </p>
    <form @submit.prevent="login">
      <label><input v-model="email" placeholder="email"></label>
      <label><input v-model="pass" placeholder="password" type="password"></label> (hint: password1)<br>
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

<style lang="less">
@import "../assets/mainStyles.less";

.login {
  border: 1px solid black;
  grid-column: 2;
  grid-row: 2;
  min-width: 30rem;
  min-height: 30rem;
}

.grid {
    .fullSize;
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