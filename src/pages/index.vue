<script setup>
import { ref, computed, onMounted } from 'vue';
import L2DataTable from '@/components/L2DataTable.vue';
import ProtocolModal from '@/components/ProtocolModal.vue';
import Logo from '@/components/Logo.vue';
import Footer from '@/components/Footer.vue';
import Sidebar from '@/components/Sidebar.vue';
import MobileFilters from '@/components/MobileFilters.vue';
import SearchBox from '@/components/SearchBox.vue';

// Filter states
const searchTerm = ref('');
const selectedType = ref('');
const selectedCategory = ref('');
const selectedNetworkStage = ref('');

// Data
const tableData = ref([]);
const loading = ref(true);

// Modal state
const isModalOpen = ref(false);
const selectedProtocol = ref(null);

// Computed properties for filters
const types = computed(() => {
  const uniqueTypes = [...new Set(tableData.value.map((item) => item.Type).filter(Boolean))];
  // Use the same custom order as the table
  const typeOrder = ['Bitcoin Native', 'Rollup', 'Sidechain', 'Meta Protocols', 'Other'];
  return typeOrder.filter((type) => uniqueTypes.includes(type));
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
  const typeOrder = ['Bitcoin Native', 'Rollup', 'Sidechain', 'Meta Protocols', 'Other'];
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

// Modal handlers
const handleOpenModal = (protocol) => {
  selectedProtocol.value = protocol;
  isModalOpen.value = true;
};

const handleCloseModal = () => {
  isModalOpen.value = false;
  selectedProtocol.value = null;
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Sticky Header -->
    <header class="sticky top-0 z-50 h-[70px] border-b border-[#e0e0e0] bg-white">
      <div class="flex h-full items-center justify-between px-4 lg:px-6">
        <div class="flex flex-col">
          <Logo />
          <div class="mt-1 text-[11px] text-[#a4a4a4]">
            Track layer 2 bitcoin projects
          </div>
        </div>

        <!-- Contribute Button -->
        <a
          href="https://github.com/layerztec/layers2"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded bg-[#f5f5f5] px-4 py-2 text-[13px] font-semibold text-black transition-colors hover:bg-[#00000020]"
        >
          Contribute
        </a>
      </div>
    </header>

    <div class="flex">
      <!-- Desktop Sidebar -->
      <Sidebar
        :types="types"
        :categories="categories"
        :network-stages="networkStages"
        :selected-type="selectedType"
        :selected-category="selectedCategory"
        :selected-network-stage="selectedNetworkStage"
        @update:selected-type="selectedType = $event"
        @update:selected-category="selectedCategory = $event"
        @update:selected-network-stage="selectedNetworkStage = $event"
      />

      <!-- Main Content -->
      <main class="flex-1 lg:ml-[230px]">
        <!-- Search Box Component -->
        <SearchBox v-model="searchTerm" />

        <!-- Mobile Filter Select Boxes -->
        <MobileFilters
          :types="types"
          :categories="categories"
          :network-stages="networkStages"
          :selected-type="selectedType"
          :selected-category="selectedCategory"
          :selected-network-stage="selectedNetworkStage"
          @update:selected-type="selectedType = $event"
          @update:selected-category="selectedCategory = $event"
          @update:selected-network-stage="selectedNetworkStage = $event"
        />

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
            @open-modal="handleOpenModal"
          />
        </div>

        <!-- Footer -->
        <Footer />
      </main>
    </div>

    <!-- Protocol Modal -->
    <ProtocolModal
      :is-open="isModalOpen"
      :protocol="selectedProtocol"
      @close="handleCloseModal"
    />
  </div>
</template>
