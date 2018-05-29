<template>
  <div>
    <span v-html="title" />
  </div>
</template>

<script>
import { getFooterMarkup } from "../../../config/common.js";
export default {
  data() {
    return {
      title: getFooterMarkup()
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
