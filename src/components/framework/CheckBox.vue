<template>
  <div class="custom-control custom-checkbox">
    <input type="checkbox" class="custom-control-input" id="inputRemember" v-model="isChecked">
    <label class="custom-control-label" for="inputRemember">{{Message}}</label>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class CheckBox extends Vue {
  @Prop([Boolean])
  public IsChecked: boolean;

  @Prop([String])
  public Message: string;

  get isChecked() {
    return this.IsChecked;
  }

  set isChecked(value: boolean) {
    console.log(value);
  }
}
</script>

<style lang="scss" scoped>

</style>