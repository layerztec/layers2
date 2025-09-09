<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6">
    <h3 class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
      Projects tracked
    </h3>
    <div class="text-3xl font-bold text-gray-900 dark:text-white">
      {{ totalProjects }}
    </div>

    <!-- Highlighted Project Title -->
    <h3 class="mb-2 mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
      Featured project
    </h3>

    <!-- Highlighted Project -->
    <div
      v-if="highlightedProject"
      class="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
      @click="handleProjectClick"
    >
      <div class="flex items-center space-x-3">
        <img
          :src="getImageUrl(highlightedProject.Image)"
          :alt="highlightedProject.Name"
          class="size-8 shrink-0 rounded"
          @error="handleImageError"
        >
        <div class="min-w-0 flex-1">
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            {{ highlightedProject.Name }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ highlightedProject.Category }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import layersData from '@/assets/data/layers-data.json';

// Emits
const emit = defineEmits(['open-modal']);

const totalProjects = computed(() => layersData.length);

// Hardcoded list of highlighted projects
const highlightedProjectNames = ['Spark', 'Citrea', 'Liquid Network', 'Ark', 'BTKN', 'Alpen Labs'];

// State for highlighted project
const highlightedProject = ref(null);

// Get random highlighted project
const getRandomHighlightedProject = () => {
  const randomIndex = Math.floor(Math.random() * highlightedProjectNames.length);
  const projectName = highlightedProjectNames[randomIndex];
  return layersData.find((project) => project.Name === projectName);
};

// Get image URL
const getImageUrl = (imageName) => {
  try {
    return new URL(`../assets/data/img/${imageName}`, import.meta.url).href;
  } catch (error) {
    return '';
  }
};

// Handle image loading errors
const handleImageError = (event) => {
  const { target } = event;
  target.style.display = 'none';
};

// Handle project click
const handleProjectClick = () => {
  if (highlightedProject.value) {
    emit('open-modal', highlightedProject.value);
  }
};

// Initialize highlighted project on mount
onMounted(() => {
  highlightedProject.value = getRandomHighlightedProject();
});
</script>
