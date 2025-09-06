<script setup>
import { ref, onUnmounted } from 'vue';

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

// Modal state
const isModalOpen = ref(false);
const selectedProtocol = ref(null);

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
    console.error('Failed to load image:', imageName, error);
    return '';
  }
};

// Modal functions
const openModal = (protocol) => {
  selectedProtocol.value = protocol;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedProtocol.value = null;
};

// Handle keyboard events
const handleKeydown = (event) => {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
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
        <div class="border-b border-[#e0e0e0] bg-[#f5f5f5] p-4">
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
            @click="openModal(item)"
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
                  <div class="text-[16px] font-medium text-[#333333]">
                    {{ item.Name || '-' }}
                  </div>
                  <div class="text-[13px] text-[#a4a4a4]">
                    {{ item.Category || '-' }}
                  </div>
                </div>
              </div>

              <!-- Data Columns -->
              <div class="flex flex-1 justify-between">
                <div class="text-[16px] text-[#333333]">
                  {{ item['Network Stage'] || '-' }}
                </div>
                <div class="text-[16px] text-[#333333]">
                  {{ item['Native Token'] || '-' }}
                </div>
                <div class="text-[16px] text-[#333333]">
                  {{ item.Founded || '-' }}
                </div>
              </div>
            </div>

            <!-- Mobile Layout -->
            <div class="flex items-center gap-4 lg:hidden">
              <!-- Logo and Name -->
              <div class="flex flex-1 items-center gap-4">
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
                  <div class="text-[16px] font-medium text-[#333333]">
                    {{ item.Name || '-' }}
                  </div>
                  <div class="text-[13px] text-[#a4a4a4]">
                    {{ item.Category || '-' }}
                  </div>
                </div>
              </div>

              <!-- Founded Column -->
              <div class="text-right text-[16px] text-[#333333]">
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
                class="size-16 rounded object-cover"
                @error="handleImageError"
              >
              <div
                v-else
                class="flex size-16 items-center justify-center rounded bg-gray-200 text-2xl text-gray-500 dark:bg-gray-600 dark:text-gray-400"
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
/* Import IBM Plex Mono font */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap');

/* Apply IBM Plex Mono to all text */
* {
  font-family: 'IBM Plex Mono', monospace;
}

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
