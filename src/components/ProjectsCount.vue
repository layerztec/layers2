<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6">
    <h3 class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
      Projects tracked
    </h3>
    <div class="text-3xl font-bold text-gray-900 dark:text-white">
      {{ totalProjects }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import layersData from '@/assets/data/layers-data.json';

const totalProjects = computed(() => layersData.length);
</script>
