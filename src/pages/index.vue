<script setup>
import useTheme from '@/composables/useTheme.js';
import L2DataTable from '@/components/L2DataTable.vue';

const { currentTheme, switchTheme } = useTheme();
</script>

<template>
  <div class="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-900">
    <!-- Header with theme toggle -->
    <header class="absolute inset-x-0 top-0 z-10">
      <div class="container mx-auto flex justify-end p-4">
        <button
          class="rounded-lg bg-white p-2 shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800"
          :title="currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="switchTheme()"
        >
          <svg
            v-if="currentTheme === 'dark'"
            xmlns="http://www.w3.org/2000/svg"
            class="size-6 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="size-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Main content -->
    <main class="container mx-auto px-4 py-16 pt-24">
      <div class="mx-auto max-w-7xl">
        <div class="mb-12 text-center">
          <h1 class="mb-8 text-5xl font-bold text-gray-900 dark:text-white md:text-6xl">
            Bitcoin Layers 2
          </h1>
          <p class="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
            A comprehensive directory of Bitcoin Layer 2 scaling solutions and protocols
          </p>
        </div>

        <!-- Data Table -->
        <L2DataTable />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Custom styles can be added here */
</style>
