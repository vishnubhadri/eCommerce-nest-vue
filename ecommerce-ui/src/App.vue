<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <v-container fluid class="align-center">
    <v-card
      variant="outlined"
      class="mx-auto pa-12 pb-8"
      max-width="700"
      min-width="550"
      min-height="550"
      rounded="lg"
    >
      <RouterView />
    </v-card>
  </v-container>
</template>

<style>
#app {
  display: flex;
  justify-content: space-between;
}
</style>
