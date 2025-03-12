<script setup>
import { RouterView } from "vue-router";
import TopMenu from "./components/TopMenu.vue";
import "./style.css";
</script>

<template>
  <TopMenu />
  <router-view></router-view>
</template>
