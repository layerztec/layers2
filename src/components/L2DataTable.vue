<script setup>
import { ref, computed, onMounted } from 'vue';
import layersData from '@/assets/data/layers-data.json';

// Reactive data
const tableData = ref([]);
const searchTerm = ref('');
const selectedCategory = ref('');
const selectedNetworkStage = ref('');
const loading = ref(true);

// Table headers
const tableHeaders = ['Name', 'Category', 'Network Stage', 'Native Token', 'Founded'];

// Get unique values for filters
const categories = computed(() => {
  const uniqueCategories = [...new Set(tableData.value.map((item) => item.Category).filter(Boolean))];
  return uniqueCategories.sort();
});

const networkStages = computed(() => {
  const uniqueStages = [...new Set(tableData.value.map((item) => item['Network Stage']).filter(Boolean))];
  return uniqueStages.sort();
});

// Computed properties
const filteredData = computed(() => {
  let filtered = tableData.value;

  // Apply search filter
  if (searchTerm.value) {
    filtered = filtered.filter((item) => Object.values(item).some((value) => {
      if (!value) return false;
      return value.toString().toLowerCase().includes(searchTerm.value.toLowerCase());
    }));
  }

  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter((item) => item.Category === selectedCategory.value);
  }

  // Apply network stage filter
  if (selectedNetworkStage.value) {
    filtered = filtered.filter((item) => item['Network Stage'] === selectedNetworkStage.value);
  }

  return filtered;
});

// Load JSON data
const loadData = async () => {
  try {
    // Use imported data directly instead of fetch
    tableData.value = layersData;
    loading.value = false;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading data:', error);
    loading.value = false;
  }
};

// Clear all filters
const clearFilters = () => {
  searchTerm.value = '';
  selectedCategory.value = '';
  selectedNetworkStage.value = '';
};

// Lifecycle
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="w-full p-4">
    <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
      L2 Protocols
    </h2>

    <!-- Search Input -->
    <div class="mb-4">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search protocols..."
        class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
      >
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-wrap gap-4">
      <!-- Category Filter -->
      <div class="min-w-48 flex-1">
        <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          v-model="selectedCategory"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">
            All Categories
          </option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>

      <!-- Network Stage Filter -->
      <div class="min-w-48 flex-1">
        <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Network Stage
        </label>
        <select
          v-model="selectedNetworkStage"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">
            All Stages
          </option>
          <option
            v-for="stage in networkStages"
            :key="stage"
            :value="stage"
          >
            {{ stage }}
          </option>
        </select>
      </div>

      <!-- Clear Filters Button -->
      <div class="flex items-end">
        <button
          class="rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
          @click="clearFilters"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table
        class="min-w-full rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <thead
          class="bg-gray-50 dark:bg-gray-700"
        >
          <tr>
            <th
              v-for="header in tableHeaders"
              :key="header"
              class="
                px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300
              "
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody
          class="
            divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800
          "
        >
          <tr
            v-for="(item, index) in filteredData"
            :key="index"
            class="
              hover:bg-gray-50 dark:hover:bg-gray-700
            "
          >
            <td
              v-for="header in tableHeaders"
              :key="header"
              class="
                whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100
              "
            >
              {{ item[header] || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="py-8 text-center"
    >
      <p
        class="text-gray-500 dark:text-gray-400"
      >
        Loading data...
      </p>
    </div>

    <!-- No Results -->
    <div
      v-else-if="filteredData.length === 0"
      class="py-8 text-center"
    >
      <p
        class="text-gray-500 dark:text-gray-400"
      >
        No protocols found.
      </p>
    </div>

    <!-- Data Count -->
    <div
      v-else
      class="mt-4 text-right text-sm text-gray-500 dark:text-gray-400"
    >
      Showing {{ filteredData.length }} of {{ tableData.length }} protocols
    </div>
  </div>
</template>

<style scoped>
/* Component styles */
</style>
