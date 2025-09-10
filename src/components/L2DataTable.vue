<script setup>
import { createSlug } from '@/utils/slug.js';

// Props
defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  filteredData: {
    type: Array,
    default: () => [],
  },
  groupedData: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(['open-modal']);

// Handle image loading errors
const handleImageError = (event) => {
  // Replace broken image with placeholder
  const { target } = event;
  target.style.display = 'none';
};

// Get image URL
const getImageUrl = (imageName) => {
  try {
    return new URL(`../assets/data/img/${imageName}`, import.meta.url).href;
  } catch (error) {
    // Handle error silently
    return '';
  }
};

// Handle row click
const handleRowClick = (protocol) => {
  emit('open-modal', protocol);
};

// Handle project name click (prevent navigation and row click)
const handleProjectNameClick = (event, protocol) => {
  event.preventDefault(); // Prevent default link navigation
  event.stopPropagation(); // Prevent row click
  emit('open-modal', protocol);
};

// Get project URL
const getProjectUrl = (protocol) => {
  const slug = createSlug(protocol.Name);
  return slug ? `/${slug}` : '#';
};
</script>

<template>
  <div>
    <!-- Table Header (Fixed at top) -->
    <div class="border border-b-0 border-[#e0e0e0] bg-white">
      <div class="border-b border-[#e0e0e0] p-4">
        <!-- Desktop Header -->
        <div class="hidden items-center gap-4 lg:flex">
          <div class="w-[300px]">
            <div class="text-[13px] font-medium text-[#a4a4a4]">
              Name
            </div>
          </div>
          <div class="flex flex-1 justify-between">
            <div class="text-[13px] font-medium text-[#a4a4a4]">
              Stage
            </div>
            <div class="text-[13px] font-medium text-[#a4a4a4]">
              Native token
            </div>
            <div class="text-[13px] font-medium text-[#a4a4a4]">
              Founded
            </div>
          </div>
        </div>

        <!-- Mobile Header -->
        <div class="grid grid-cols-2 gap-4 lg:hidden">
          <div class="text-[13px] font-medium text-[#a4a4a4]">
            Name
          </div>
          <div class="text-right text-[13px] font-medium text-[#a4a4a4]">
            Founded
          </div>
        </div>
      </div>
    </div>

    <!-- Table Content -->
    <div class="space-y-0">
      <div
        v-for="(items, type) in groupedData"
        :key="type"
        class="border border-t-0 border-[#e0e0e0]"
      >
        <!-- Type Section Header -->
        <div class="border-b border-[#e0e0e0] bg-gray-50 p-4">
          <div class="text-[13px] font-medium text-[#a4a4a4]">
            {{ type }}
          </div>
        </div>

        <!-- Table Rows -->
        <div class="divide-y divide-[#e0e0e0]">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="cursor-pointer p-4 transition-colors duration-200 hover:bg-gray-50"
            @click="handleRowClick(item)"
          >
            <!-- Desktop Layout -->
            <div class="hidden items-center gap-4 lg:flex">
              <!-- Logo and Name -->
              <div class="flex w-[300px] items-center gap-4">
                <div class="flex size-11 items-center justify-center overflow-hidden rounded bg-gray-200">
                  <img
                    v-if="item.Image"
                    :src="getImageUrl(item.Image)"
                    :alt="`${item.Name} logo`"
                    class="size-full object-cover"
                    @error="handleImageError"
                  >
                  <div
                    v-else
                    class="text-xs text-gray-500"
                  >
                    ?
                  </div>
                </div>
                <div class="flex flex-col">
                  <a
                    :href="getProjectUrl(item)"
                    class="text-[16px] font-medium text-[#333333] hover:text-blue-600 hover:underline"
                    @click="handleProjectNameClick($event, item)"
                  >
                    {{ item.Name || '-' }}
                  </a>
                  <div class="text-[13px] text-[#a4a4a4]">
                    {{ item.Category || '-' }}
                  </div>
                </div>
              </div>

              <!-- Data Columns -->
              <div class="flex flex-1 justify-between">
                <div class="text-[13px] font-medium text-[#333333]">
                  {{ item['Network Stage'] || '-' }}
                </div>
                <div class="text-[13px] font-medium text-[#333333]">
                  {{ item['Native Token'] || '-' }}
                </div>
                <div class="text-[13px] font-medium text-[#333333]">
                  {{ item.Founded || '-' }}
                </div>
              </div>
            </div>

            <!-- Mobile Layout -->
            <div class="flex items-center gap-3 lg:hidden">
              <!-- Logo and Name -->
              <div class="flex min-w-0 flex-1 items-center gap-3">
                <div class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded bg-gray-200">
                  <img
                    v-if="item.Image"
                    :src="getImageUrl(item.Image)"
                    :alt="`${item.Name} logo`"
                    class="size-full object-cover"
                    @error="handleImageError"
                  >
                  <div
                    v-else
                    class="text-xs text-gray-500"
                  >
                    ?
                  </div>
                </div>
                <div class="flex min-w-0 flex-1 flex-col">
                  <a
                    :href="getProjectUrl(item)"
                    class="truncate text-[14px] font-medium text-[#333333] hover:text-blue-600 hover:underline"
                    @click="handleProjectNameClick($event, item)"
                  >
                    {{ item.Name || '-' }}
                  </a>
                  <div class="truncate text-[11px] text-[#a4a4a4]">
                    {{ item.Category || '-' }}
                  </div>
                </div>
              </div>

              <!-- Founded Column -->
              <div class="shrink-0 text-right text-[13px] font-medium text-[#333333]">
                {{ item.Founded || '-' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="py-8 text-center"
    >
      <p class="text-[#a4a4a4]">
        Loading data...
      </p>
    </div>

    <!-- No Results -->
    <div
      v-else-if="Object.keys(groupedData).length === 0"
      class="py-8 text-center"
    >
      <p class="text-[#a4a4a4]">
        No protocols found.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Table-specific styles can be added here if needed */
</style>
