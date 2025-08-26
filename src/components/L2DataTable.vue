<script setup>
import { ref, computed, onMounted } from 'vue';
import layersData from '@/assets/data/layers-data.json';

// Reactive data
const tableData = ref([]);
const searchTerm = ref('');
const loading = ref(true);

// Table headers
const tableHeaders = ['Name', 'Category', 'Network Stage', 'Native Token', 'Fundraising / Capital', 'Founded'];

// Computed properties
const filteredData = computed(() => {
  if (!searchTerm.value) return tableData.value;

  return tableData.value.filter((item) => Object.values(item).some((value) => {
    if (!value) return false;
    return value.toString().toLowerCase().includes(searchTerm.value.toLowerCase());
  }));
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
                px-6 py-3 text-xs font-medium text-left uppercase tracking-wider text-gray-500 dark:text-gray-300
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
                px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-gray-100
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
      class="mt-4 text-sm text-gray-600 dark:text-gray-400"
    >
      Showing {{ filteredData.length }} of {{ tableData.length }} protocols
    </div>
  </div>
</template>

<style scoped>
/* Component styles */
</style>
