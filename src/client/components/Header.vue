<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-primary">
      <div class="container">
        <button class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarExpander"
                aria-controls="navbarExpander"
                aria-expanded="false"
                aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <router-link class="navbar-brand"
                     to="/">
          <img src="../assets/favicon/logo.svg"
               class="em2 d-inline-block"
               alt="" />
        </router-link>

        <div class="collapse navbar-collapse"
             id="navbarExpander">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <router-link class="nav-item nav-link"
                         active-class="active"
                         exact
                         :to="{name: routeNames.Folder}">
              Folders
            </router-link>
            <router-link v-if="$route.params.id"
                         class="nav-item nav-link"
                         active-class="active"
                         :to="{name: routeNames.Word, params: $route.params.id}">
              Words
            </router-link>
          </ul>

          <div class="my-2 my-lg-0">
            {{this.auth.user.name}} |
            <router-link to="/logout">
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
import { State } from "vuex-class";
import * as I from "../types/interfaces";
import { ComponentRouteNames } from "../router";
import { Provide } from "vue-property-decorator";

@Component
export default class Header extends Vue {
  @State folder: I.IFolderState;
  @State auth: I.IAuthState;
  @Provide() routeNames = ComponentRouteNames;

  mounted() {}
  created() {}
}
</script>

<style lang="scss" scoped>
</style>
