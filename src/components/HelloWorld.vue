<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="hello-world">
    <h2>{{ msg }}</h2>
  </div>
</template>

<style scoped>
.hello-world {
  margin: 20px 0;
}
</style>
