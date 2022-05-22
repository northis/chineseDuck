<template>
  <vue-telegram-login mode="redirect"
                      telegram-login="ChineseDuckBot"
                      redirect-url="https://chineseduck.site/api/v1/user/login" />
</template>

<script>
import { vueTelegramLogin } from "vue-telegram-login";
export default {
  name: "telegram-login",
  components: { vueTelegramLogin }
};
</script>

<style lang="scss" scoped>
</style>