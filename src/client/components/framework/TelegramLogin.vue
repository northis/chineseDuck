<template>
  <div ref="telegramDiv" />
</template>

<script>
export default {
  name: "vue-telegram-login",
  mounted() {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?3";

    script.setAttribute("data-size", "large");
    script.setAttribute("data-telegram-login", "ChineseDuckBot");
    script.setAttribute("data-request-access", "read");

    const authUrl = `https://${window.location.hostname}/api/v1/user/login`;
    script.setAttribute("data-auth-url", authUrl);
    this.$refs.telegramDiv.appendChild(script);
  }
};
</script>

<style lang="scss" scoped>
</style>