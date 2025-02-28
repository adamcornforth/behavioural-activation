<script setup lang="ts">
import HelloWorld from '../components/HelloWorld.vue'
</script>

<template>
  <div class="home-page">
    <HelloWorld msg="Behavioural Activation App" />
    <div class="features">
      <div class="feature">
        <h3>Track Activities</h3>
        <p>Record your daily activities and mood</p>
      </div>
      <div class="feature">
        <h3>Set Goals</h3>
        <p>Create meaningful goals to work towards</p>
      </div>
      <div class="feature">
        <h3>Monitor Progress</h3>
        <p>See how your activities affect your mood over time</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.features {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  gap: 20px;
}

.feature {
  flex: 1;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
}

.feature h3 {
  color: var(--primary-color);
  margin-bottom: 10px;
}
</style>
