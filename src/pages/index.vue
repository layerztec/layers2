<script setup>
import { ref, computed, onMounted } from 'vue';
import L2DataTable from '@/components/L2DataTable.vue';
import Logo from '@/components/Logo.vue';

// Filter states
const searchTerm = ref('');
const selectedType = ref('');
const selectedCategory = ref('');
const selectedNetworkStage = ref('');

// Data
const tableData = ref([]);
const loading = ref(true);

// Computed properties for filters
const types = computed(() => {
  const uniqueTypes = [...new Set(tableData.value.map((item) => item.Type).filter(Boolean))];
  return uniqueTypes.sort();
});

const categories = computed(() => {
  const uniqueCategories = [...new Set(tableData.value.map((item) => item.Category).filter(Boolean))];
  return uniqueCategories.sort();
});

const networkStages = computed(() => {
  const uniqueStages = [...new Set(tableData.value.map((item) => item['Network Stage']).filter(Boolean))];
  return uniqueStages.sort();
});

// Filtered data
const filteredData = computed(() => {
  let filtered = [...tableData.value];

  // Apply search filter
  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase();
    filtered = filtered.filter((item) => item.Name?.toLowerCase().includes(searchLower)
      || item.Category?.toLowerCase().includes(searchLower)
      || item['Network Stage']?.toLowerCase().includes(searchLower)
      || item['Native Token']?.toLowerCase().includes(searchLower)
      || item.Founded?.toLowerCase().includes(searchLower));
  }

  // Apply type filter
  if (selectedType.value) {
    filtered = filtered.filter((item) => item.Type === selectedType.value);
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

// Grouped data
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

// Load data
const loadData = async () => {
  try {
    loading.value = true;
    const data = await import('@/assets/data/layers-data.json');
    tableData.value = data.default;
  } catch (error) {
    // Handle error silently
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Sticky Header -->
    <header class="sticky top-0 z-50 h-[70px] border-b border-[#e0e0e0] bg-white">
      <div class="flex h-full items-center px-6">
        <div class="flex flex-col">
          <Logo />
          <div class="mt-1 text-[11px] text-[#a4a4a4]">
            Track bitcoin layers 2 projects
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Desktop Sidebar (hidden on mobile) -->
      <aside class="hidden lg:fixed lg:left-0 lg:top-[70px] lg:block lg:h-[calc(100vh-70px)] lg:w-[230px] lg:overflow-y-auto lg:border-r lg:border-[#e0e0e0] lg:bg-white">
        <div class="space-y-4 p-4">
          <!-- Type Filter -->
          <div class="space-y-0.5">
            <div class="px-2 py-1 text-[11px] font-medium text-[#a4a4a4]">
              Type
            </div>
            <div
              v-for="type in types"
              :key="type"
              :class="[
                'cursor-pointer rounded px-2 py-1 text-[13px] font-semibold transition-colors',
                selectedType === type
                  ? 'bg-[#f5f5f5] text-[#333333]'
                  : 'text-[#333333] hover:bg-gray-50'
              ]"
              @click="selectedType = selectedType === type ? '' : type"
            >
              {{ type }}
            </div>
          </div>

          <!-- Category Filter -->
          <div class="space-y-0.5">
            <div class="px-2 py-1 text-[11px] font-medium text-[#a4a4a4]">
              Category
            </div>
            <div
              v-for="category in categories"
              :key="category"
              :class="[
                'cursor-pointer rounded px-2 py-1 text-[13px] font-semibold transition-colors',
                selectedCategory === category
                  ? 'bg-[#f5f5f5] text-[#333333]'
                  : 'text-[#333333] hover:bg-gray-50'
              ]"
              @click="selectedCategory = selectedCategory === category ? '' : category"
            >
              {{ category }}
            </div>
          </div>

          <!-- Stage Filter -->
          <div class="space-y-0.5">
            <div class="px-2 py-1 text-[11px] font-medium text-[#a4a4a4]">
              Stage
            </div>
            <div
              v-for="stage in networkStages"
              :key="stage"
              :class="[
                'cursor-pointer rounded px-2 py-1 text-[13px] font-semibold transition-colors',
                selectedNetworkStage === stage
                  ? 'bg-[#f5f5f5] text-[#333333]'
                  : 'text-[#333333] hover:bg-gray-50'
              ]"
              @click="selectedNetworkStage = selectedNetworkStage === stage ? '' : stage"
            >
              {{ stage }}
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 lg:ml-[230px]">
        <!-- Fixed Search Bar -->
        <div class="sticky top-[70px] z-40 flex h-[70px] items-center border-b border-[#e0e0e0] bg-white px-6">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search projects..."
            class="w-full text-[16px] text-[#a4a4a4] placeholder:text-[#a4a4a4] focus:outline-none"
          >
        </div>

        <!-- Mobile Filter Select Boxes (visible only on mobile) -->
        <div class="border-b border-[#e0e0e0] bg-white p-3 lg:hidden">
          <div class="grid grid-cols-1 gap-2">
            <!-- Type Filter -->
            <select
              v-model="selectedType"
              class="w-full rounded bg-[#f5f5f5] p-2 text-[12px] font-semibold text-[#333333] focus:outline-none"
            >
              <option value="">
                All types
              </option>
              <option
                v-for="type in types"
                :key="type"
                :value="type"
              >
                {{ type }}
              </option>
            </select>

            <!-- Category Filter -->
            <select
              v-model="selectedCategory"
              class="w-full rounded bg-[#f5f5f5] p-2 text-[12px] font-semibold text-[#333333] focus:outline-none"
            >
              <option value="">
                All categories
              </option>
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>

            <!-- Stage Filter -->
            <select
              v-model="selectedNetworkStage"
              class="w-full rounded bg-[#f5f5f5] p-2 text-[12px] font-semibold text-[#333333] focus:outline-none"
            >
              <option value="">
                All stages
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
        </div>

        <!-- Content Area -->
        <div class="p-4 lg:p-6">
          <div class="mb-6">
            <h1 class="mb-1 text-[16px] font-medium text-[#333333]">
              Projects
            </h1>
            <p class="text-[11px] text-[#a4a4a4]">
              Showing {{ filteredData.length }} of {{ tableData.length }} protocols
            </p>
          </div>

          <!-- Data Table Component -->
          <L2DataTable
            :table-data="tableData"
            :filtered-data="filteredData"
            :grouped-data="groupedData"
            :loading="loading"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Import IBM Plex Mono font */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap');

/* Apply IBM Plex Mono to all text */
* {
  font-family: 'IBM Plex Mono', monospace;
}

/* Mobile overflow prevention */
@media (width <= 1023px) {
  body {
    overflow-x: hidden;
  }

  .mobile-text {
    word-break: break-word;
    overflow-wrap: break-word;
  }
}
</style>
