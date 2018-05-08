<template>
</template>

<script lang="ts">
import Vue from "vue";
import * as T from "../types/interfaces";
import Component from "vue-class-component";

@Component
export default class Logout extends Vue {
  mounted() {
    this.$router.push('/');
  }
}
</script>

<style scoped>

</style>
