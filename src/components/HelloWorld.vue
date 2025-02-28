<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="hello-world">
    <h2>{{ msg }}</h2>
    <p>A tool to help you engage in meaningful activities</p>
  </div>
</template>

<style scoped>
.hello-world {
  margin: 20px 0;
  padding: 20px;
  background-color: #f0f8ff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h2 {
  color: var(--primary-color);
}
</style>
