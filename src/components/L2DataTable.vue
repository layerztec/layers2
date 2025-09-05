<script setup>
import {
  ref, computed, onMounted, onUnmounted,
} from 'vue';
import layersData from '@/assets/data/layers-data.json';

// Reactive data
const tableData = ref([]);
const searchTerm = ref('');
const selectedCategory = ref('');
const selectedType = ref('');
const selectedNetworkStage = ref('');
const loading = ref(true);

// Modal state
const isModalOpen = ref(false);
const selectedProtocol = ref(null);

// Get unique values for filters
const categories = computed(() => {
  const uniqueCategories = [...new Set(tableData.value.map((item) => item.Category).filter(Boolean))];
  return uniqueCategories.sort();
});

const types = computed(() => {
  const uniqueTypes = [...new Set(tableData.value.map((item) => item.Type).filter(Boolean))];
  return uniqueTypes.sort();
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

  // Apply type filter
  if (selectedType.value) {
    filtered = filtered.filter((item) => item.Type === selectedType.value);
  }

  // Apply network stage filter
  if (selectedNetworkStage.value) {
    filtered = filtered.filter((item) => item['Network Stage'] === selectedNetworkStage.value);
  }

  return filtered;
});

// Group filtered data by type
const groupedData = computed(() => {
  const groups = {};

  filteredData.value.forEach((item) => {
    const type = item.Type || 'Uncategorized';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
  });

  // Sort groups by custom type order and sort items within each group by name
  const typeOrder = ['Bitcoin Native', 'Rollup', 'Sidechain', 'Other'];
  const sortedGroups = {};

  typeOrder.forEach((type) => {
    if (groups[type]) {
      sortedGroups[type] = groups[type].sort((a, b) => a.Name.localeCompare(b.Name));
    }
  });

  return sortedGroups;
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
  selectedType.value = '';
  selectedNetworkStage.value = '';
};

// Handle image loading errors
const handleImageError = (event) => {
  // Replace broken image with placeholder
  const { target } = event;
  target.style.display = 'none';
  const placeholder = target.nextElementSibling;
  if (placeholder) {
    placeholder.style.display = 'flex';
  }
};

// Get image URL for a protocol
const getImageUrl = (imageName) => new URL(`../assets/data/img/${imageName}`, import.meta.url).href;

// Modal functions
const openModal = (protocol) => {
  selectedProtocol.value = protocol;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedProtocol.value = null;
};

// Close modal on escape key
const handleKeydown = (event) => {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal();
  }
};

// Lifecycle
onMounted(() => {
  loadData();
  document.addEventListener('keydown', handleKeydown);
});

// Cleanup
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
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
      <!-- Type Filter -->
      <div class="min-w-48 flex-1">
        <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Type
        </label>
        <select
          v-model="selectedType"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">
            All Types
          </option>
          <option
            v-for="type in types"
            :key="type"
            :value="type"
          >
            {{ type }}
          </option>
        </select>
      </div>

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

    <!-- Grouped Table -->
    <div class="space-y-6">
      <div
        v-for="(items, type) in groupedData"
        :key="type"
        class="overflow-x-auto"
      >
        <!-- Type Section Header -->
        <div class="mb-4 flex items-center justify-between pb-3">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ type }}
            <span class="ml-3 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {{ items.length }} {{ items.length === 1 ? 'protocol' : 'protocols' }}
            </span>
          </h3>
        </div>

        <!-- Table for this type -->
        <table
          class="min-w-full rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <thead
            class="bg-gray-50 dark:bg-gray-700"
          >
            <tr>
              <!-- Logo Header -->
              <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Logo
              </th>

              <!-- Name Header -->
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Name
              </th>

              <!-- Category Header -->
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Category
              </th>

              <!-- Network Stage Header -->
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Network Stage
              </th>

              <!-- Native Token Header -->
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Native Token
              </th>

              <!-- Founded Header -->
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Founded
              </th>
            </tr>
          </thead>
          <tbody
            class="
              divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800
            "
          >
            <tr
              v-for="(item, index) in items"
              :key="index"
              class="
                cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700
              "
              @click="openModal(item)"
            >
              <!-- Logo Column -->
              <td class="whitespace-nowrap px-6 py-4 text-center">
                <div class="flex items-center justify-center">
                  <img
                    v-if="item.Image"
                    :src="getImageUrl(item.Image)"
                    :alt="`${item.Name} logo`"
                    class="size-8 rounded-full object-cover"
                    @error="handleImageError"
                  >
                  <div
                    v-else
                    class="flex size-8 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                  >
                    ?
                  </div>
                </div>
              </td>

              <!-- Name Column -->
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ item.Name || '-' }}
              </td>

              <!-- Category Column -->
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ item.Category || '-' }}
              </td>

              <!-- Network Stage Column -->
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ item['Network Stage'] || '-' }}
              </td>

              <!-- Native Token Column -->
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ item['Native Token'] || '-' }}
              </td>

              <!-- Founded Column -->
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ item.Founded || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
      v-else-if="Object.keys(groupedData).length === 0"
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

    <!-- Protocol Details Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click="closeModal"
    >
      <div
        class="relative mx-4 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
        @click.stop
      >
        <!-- Close Button -->
        <button
          class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          @click="closeModal"
        >
          <svg
            class="size-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Modal Content -->
        <div
          v-if="selectedProtocol"
          class="space-y-6"
        >
          <!-- Header with Logo and Name -->
          <div class="flex items-center space-x-4">
            <div class="shrink-0">
              <img
                v-if="selectedProtocol.Image"
                :src="getImageUrl(selectedProtocol.Image)"
                :alt="`${selectedProtocol.Name} logo`"
                class="size-16 rounded-full object-cover"
                @error="handleImageError"
              >
              <div
                v-else
                class="flex size-16 items-center justify-center rounded-full bg-gray-200 text-2xl text-gray-500 dark:bg-gray-600 dark:text-gray-400"
              >
                ?
              </div>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ selectedProtocol.Name }}
              </h3>
              <div class="mt-1 flex items-center space-x-2">
                <span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ selectedProtocol.Type }}
                </span>
                <span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {{ selectedProtocol.Category }}
                </span>
              </div>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Network Stage -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Network Stage
              </h4>
              <p class="text-lg text-gray-900 dark:text-white">
                {{ selectedProtocol['Network Stage'] || 'Not specified' }}
              </p>
            </div>

            <!-- Native Token -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Native Token
              </h4>
              <p class="text-lg text-gray-900 dark:text-white">
                {{ selectedProtocol['Native Token'] || 'Not specified' }}
              </p>
            </div>

            <!-- Founded -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Founded
              </h4>
              <p class="text-lg text-gray-900 dark:text-white">
                {{ selectedProtocol.Founded || 'Not specified' }}
              </p>
            </div>

            <!-- Type -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Type
              </h4>
              <p class="text-lg text-gray-900 dark:text-white">
                {{ selectedProtocol.Type || 'Not specified' }}
              </p>
            </div>
          </div>

          <!-- Additional Info -->
          <div
            v-if="selectedProtocol.Category"
            class="space-y-2"
          >
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Category
            </h4>
            <p class="text-lg text-gray-900 dark:text-white">
              {{ selectedProtocol.Category }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
