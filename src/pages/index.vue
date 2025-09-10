<script setup>
import {
  ref, computed, onMounted, watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import L2DataTable from '@/components/L2DataTable.vue';
import ProtocolModal from '@/components/ProtocolModal.vue';
import Logo from '@/components/Logo.vue';
import Footer from '@/components/Footer.vue';
import Sidebar from '@/components/Sidebar.vue';
import MobileFilters from '@/components/MobileFilters.vue';
import SearchBox from '@/components/SearchBox.vue';
import ProjectsCount from '@/components/ProjectsCount.vue';
import GitHubActivity from '@/components/GitHubActivity.vue';
import Layer2Investments from '@/components/Layer2Investments.vue';
import { createSlug, findProjectBySlug } from '@/utils/slug.js';

// Props for URL handling
defineProps({
  projectSlug: {
    type: String,
    default: null,
  },
});

// Router
const route = useRoute();
const router = useRouter();

// Filter states
const searchTerm = ref('');
const selectedType = ref('');
const selectedCategory = ref('');
const selectedNetworkStage = ref('');

// Data
const tableData = ref([]);
const fundingData = ref([]);
const stewardsData = ref([]);
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

// Calculate total funding for each project (including stewards)
const projectFunding = computed(() => {
  const fundingMap = new Map();

  // Process main project funding
  fundingData.value.forEach((project) => {
    const projectName = project.ProjectName;
    let totalFunding = 0;

    project.FundingRounds?.forEach((round) => {
      const amount = parseFloat(round.Amount?.replace(/,/g, '') || '0');
      totalFunding += amount;
    });

    fundingMap.set(projectName, totalFunding);
  });

  // Process stewards funding and add to main projects
  stewardsData.value.forEach((steward) => {
    const stewardName = steward.Steward;
    let stewardFunding = 0;

    // Find steward funding in funding data
    const stewardFundingData = fundingData.value.find((p) => p.ProjectName === stewardName);
    if (stewardFundingData) {
      stewardFundingData.FundingRounds?.forEach((round) => {
        const amount = parseFloat(round.Amount?.replace(/,/g, '') || '0');
        stewardFunding += amount;
      });
    }

    // Add steward funding to each project they support
    steward.Projects?.forEach((projectName) => {
      const currentFunding = fundingMap.get(projectName) || 0;
      fundingMap.set(projectName, currentFunding + stewardFunding);
    });
  });

  return fundingMap;
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

  // Sort groups by custom type order and sort items within each group by funding (desc) then name (asc)
  const typeOrder = ['Bitcoin Native', 'Rollup', 'Sidechain', 'Meta Protocols', 'Other'];
  const sortedGroups = {};
  typeOrder.forEach((type) => {
    if (groups[type]) {
      sortedGroups[type] = groups[type].sort((a, b) => {
        const fundingA = projectFunding.value.get(a.Name) || 0;
        const fundingB = projectFunding.value.get(b.Name) || 0;

        // First sort by funding (descending)
        if (fundingA !== fundingB) {
          return fundingB - fundingA;
        }

        // Then sort by name (ascending)
        return a.Name.localeCompare(b.Name);
      });
    }
  });
  return sortedGroups;
});

// Load data
const loadData = async () => {
  try {
    loading.value = true;
    const [layersData, fundingDataImport, stewardsDataImport] = await Promise.all([
      import('@/assets/data/layers-data.json'),
      import('@/assets/data/funding-rounds.json'),
      import('@/assets/data/stewards.json'),
    ]);

    tableData.value = layersData.default;
    fundingData.value = fundingDataImport.default;
    stewardsData.value = stewardsDataImport.default;
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

  // Update URL
  const slug = createSlug(protocol.Name);
  if (slug) {
    router.push(`/${slug}`);
  }
};

const handleCloseModal = () => {
  isModalOpen.value = false;
  selectedProtocol.value = null;

  // Update URL to home
  router.push('/');
};

// Handle URL changes and open modal if project slug is provided
const handleUrlChange = () => {
  const { projectSlug } = route.params;

  if (projectSlug && tableData.value.length > 0) {
    const project = findProjectBySlug(tableData.value, projectSlug);
    if (project) {
      selectedProtocol.value = project;
      isModalOpen.value = true;
    } else {
      // Project not found, redirect to home
      router.push('/');
    }
  } else if (!projectSlug) {
    // No project slug, close modal if open
    isModalOpen.value = false;
    selectedProtocol.value = null;
  }
};

// Watch for route changes
watch(() => route.params.projectSlug, () => {
  handleUrlChange();
});

// Watch for data loading completion
watch(() => tableData.value.length, () => {
  if (tableData.value.length > 0) {
    handleUrlChange();
  }
});

// Update meta tags when modal opens
watch(() => selectedProtocol.value, (newProtocol) => {
  if (newProtocol && typeof document !== 'undefined') {
    // Update page title
    document.title = `${newProtocol.Name} - layers2.com`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      const description = `${newProtocol.Name} - ${newProtocol.Category} Bitcoin Layer 2 project. `
        + `${newProtocol.Description || 'Learn more about this Bitcoin scaling solution.'}`;
      metaDescription.setAttribute('content', description);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', `${newProtocol.Name} - layers2.com`);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      const ogDesc = `${newProtocol.Name} - ${newProtocol.Category} Bitcoin Layer 2 project. `
        + `${newProtocol.Description || 'Learn more about this Bitcoin scaling solution.'}`;
      ogDescription.setAttribute('content', ogDesc);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `https://layers2.com/${createSlug(newProtocol.Name)}`);
    }
  } else if (typeof document !== 'undefined') {
    // Reset to default meta tags
    document.title = 'layers2.com - Track bitcoin layers 2 projects';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      const defaultDesc = 'Track bitcoin layers 2 projects - Lightning, Spark, Liquid, Citrea, '
        + 'Stacks, Rootstock, Runes, Ordinals and more.';
      metaDescription.setAttribute('content', defaultDesc);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'layers2.com - Track bitcoin layers 2 projects');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      const defaultOgDesc = 'Track bitcoin layers 2 projects - Lightning, Spark, Liquid, Citrea, '
        + 'Stacks, Rootstock, Runes, Ordinals and more.';
      ogDescription.setAttribute('content', defaultOgDesc);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://layers2.com');
    }
  }
});

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
          class="rounded bg-gray-100 px-4 py-2 text-[13px] font-semibold text-black transition-colors hover:bg-gray-200"
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

        <!-- Stats Blocks -->
        <div class="p-4 lg:p-6">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ProjectsCount @open-modal="handleOpenModal" />
            <Layer2Investments />
            <GitHubActivity />
          </div>
        </div>

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
              Showing {{ filteredData.length }} protocols
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
