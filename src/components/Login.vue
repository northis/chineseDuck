<template>
  <div>
    <h2>Login</h2>
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
import * as T from '../store/auth/types';

@Component
export default class Login extends Vue {
  @State auth: T.IAuthState;

  mounted() {
    console.log("Login mounted");

    console.log(this.auth);
    //this.fetchData();
  }
  created () {
  }
}
</script>

<style lang="less">
@import '../assets/mainStyles.less';
body {
    font-family: @mainFont;
    color:@textColor;
    background-color: @backgroundColor,
}

.grid {
  display: grid;
  grid-template-columns: 250px repeat(12, 1fr);
  grid-column-gap: 10px;
}

.error {
  color: red;
}
</style>