<script setup>
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="count++">+1</button>
  </div>
</template>

<style scoped>
button {
  padding: 8px 12px;
}
</style>
