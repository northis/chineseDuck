<template>
  <div>
      <router-link to="/login">Login</router-link>
      <app-header></app-header>
      <app-main></app-main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from 'vue-class-component'
import Header from '../Header.vue'
import Main from '../Main.vue'

@Component({
    name: 'app',
    components: {
        'app-header': Header,
        'app-main': Main
    }
})
export default class App extends Vue {
}

</script>

<style lang="less">

@import '../../assets/mainStyles.less';

@media screen and (max-width: @mediaSmallWidth) {
    h1 { 
        font-size: 70px; 
        padding: 1px; 
    }
 
    h2 { 
        font-size: 13px; 
        padding: 1px;
    }
 
    body { 
        font-size: 13px; 
    }
}
 
@media screen and (max-width: @mediaMediumWidth) {
    .left-col { 
        width: 100%; 
    }
 
    .sidebar { 
        width: 100%; 
    }
}
</style>
