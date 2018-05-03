<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-primary">
      <div class="container">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarExpander" aria-controls="navbarExpander" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <router-link class="navbar-brand" to="/">
          <img src="../assets/favicon/logo.svg" class="em2 d-inline-block" alt="" />
        </router-link>

        <div class="collapse navbar-collapse" id="navbarExpander">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item active">
              <a class="nav-link" href="#">Home
                <span class="sr-only">(current)</span>
              </a>
            </li>
          </ul>
          <div class="my-2 my-lg-0">
            <span>{{this.auth.user.name}}</span>
            <router-link class="nav-link" to="/logout">
              Logout
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script  lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State, Action, Getter } from "vuex-class";
import { IRootState } from "../types/interfaces";
import * as T from "../types/interfaces";

@Component
export default class Header extends Vue {
  @Getter getRootState: IRootState;
  @State auth: T.IAuthState;

  mounted() {
    console.log("Header mounted");
    //this.fetchData();
  }
  created() {
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/mainStyles.scss";
</style>
