<script setup>
import {
  computed, onMounted, onUnmounted, watch,
} from 'vue';
import fundingRoundsData from '@/assets/data/funding-rounds.json';
import stewardsData from '@/assets/data/stewards.json';

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  protocol: {
    type: Object,
    default: null,
  },
});

// Emits
const emit = defineEmits(['close']);

// Computed properties for funding data
const selectedProtocolFunding = computed(() => {
  if (!props.protocol) return null;
  return fundingRoundsData.find((project) => project.ProjectName === props.protocol.Name);
});

const totalFunding = computed(() => {
  if (!selectedProtocolFunding.value) return 0;
  return selectedProtocolFunding.value.FundingRounds.reduce((total, round) => {
    const amount = parseFloat(round.Amount.replace(/,/g, ''));
    return total + amount;
  }, 0);
});

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(amount);

const allInvestors = computed(() => {
  if (!selectedProtocolFunding.value) return [];
  const investors = new Set();
  selectedProtocolFunding.value.FundingRounds.forEach((round) => {
    round.Investors.forEach((investor) => {
      // Only add investors that are not "Unknown"
      if (investor && investor !== 'Unknown') {
        investors.add(investor);
      }
    });
  });
  return Array.from(investors);
});

// Find stewards for the current project
const projectStewards = computed(() => {
  if (!props.protocol) return [];
  return stewardsData.filter((steward) => steward.Projects.includes(props.protocol.Name));
});

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

// Close modal function
const closeModal = () => {
  emit('close');
};

// Handle keyboard events
const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.isOpen) {
    closeModal();
  }
};

// Handle body scroll lock
const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden';
};

const unlockBodyScroll = () => {
  document.body.style.overflow = '';
};

// Watch for modal open/close to manage body scroll
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    lockBodyScroll();
  } else {
    unlockBodyScroll();
  }
});

// Add event listener when component mounts
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  // Lock scroll if modal is already open
  if (props.isOpen) {
    lockBodyScroll();
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  // Ensure scroll is unlocked when component unmounts
  unlockBodyScroll();
});
</script>

<template>
  <!-- Protocol Details Modal -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-300/95 p-0 lg:p-4"
    @click="closeModal"
  >
    <div
      class="relative flex size-full max-h-screen max-w-none flex-col bg-white shadow-xl dark:bg-gray-800 lg:max-h-[90vh] lg:max-w-2xl lg:rounded-lg"
      @click.stop
    >
      <!-- Fixed Header -->
      <div class="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
        <div class="flex items-center space-x-4">
          <div class="shrink-0">
            <img
              v-if="protocol?.Image"
              :src="getImageUrl(protocol.Image)"
              :alt="`${protocol.Name} logo`"
              class="size-12 rounded object-cover"
              @error="handleImageError"
            >
            <div
              v-else
              class="flex size-12 items-center justify-center rounded bg-gray-200 text-xl text-gray-500 dark:bg-gray-600 dark:text-gray-400"
            >
              ?
            </div>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ protocol?.Name || 'Protocol Details' }}
            </h3>
            <div class="mt-1 flex items-center space-x-2">
              <span class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {{ protocol?.Type || 'Unknown' }}
              </span>
              <span class="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {{ protocol?.Category || 'Unknown' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <button
          class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
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
      </div>

      <!-- Scrollable Content Area -->
      <div class="flex-1 overflow-y-auto p-6">
        <div
          v-if="protocol"
          class="space-y-6"
        >
          <!-- Description -->
          <div
            v-if="protocol.Description"
            class="space-y-2"
          >
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Description
            </h4>
            <p class="text-[13px] text-gray-900 dark:text-white">
              {{ protocol.Description }}
            </p>
          </div>

          <!-- Stewards -->
          <div
            v-if="projectStewards.length > 0"
            class="space-y-3 rounded-lg bg-white dark:bg-gray-800"
          >
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Stewards
            </h4>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                v-for="steward in projectStewards"
                :key="steward.Steward"
                class="flex items-center space-x-3 rounded-lg border border-gray-100 p-3 dark:border-gray-700"
              >
                <div class="shrink-0">
                  <img
                    v-if="steward.Image"
                    :src="getImageUrl(steward.Image)"
                    :alt="`${steward.Steward} logo`"
                    class="size-10 rounded object-cover"
                    @error="handleImageError"
                  >
                  <div
                    v-else
                    class="flex size-10 items-center justify-center rounded bg-gray-200 text-sm text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                  >
                    ?
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <h5 class="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {{ steward.Steward }}
                  </h5>
                </div>
                <div class="shrink-0">
                  <a
                    v-if="steward.Website"
                    :href="steward.Website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Website
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Investment History -->
          <div
            v-if="selectedProtocolFunding"
            class="space-y-3 rounded-lg bg-[#f5f5f5] p-4"
          >
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Investment History
              </h4>
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(totalFunding) }}
              </div>
            </div>
            <div class="space-y-2">
              <div
                v-for="(round, index) in selectedProtocolFunding.FundingRounds"
                :key="index"
                class="flex items-center justify-between text-[13px]"
              >
                <div class="flex items-center space-x-3">
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ round.Year }}
                  </span>
                  <span class="text-gray-600 dark:text-gray-300">
                    {{ round.Round }}
                  </span>
                </div>
                <div class="text-right">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(parseFloat(round.Amount.replace(/,/g, ''))) }}
                  </div>
                </div>
              </div>
            </div>
            <!-- All Investors -->
            <div
              v-if="allInvestors.length > 0"
              class="border-t border-gray-200 pt-3 dark:border-gray-600"
            >
              <h5 class="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                Investors
              </h5>
              <div class="text-[12px] text-gray-600 dark:text-gray-300">
                {{ allInvestors.join(', ') }}
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
              <p class="text-[13px] text-gray-900 dark:text-white">
                {{ protocol['Network Stage'] || 'Not specified' }}
              </p>
            </div>

            <!-- Native Token -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Native Token
              </h4>
              <p class="text-[13px] text-gray-900 dark:text-white">
                {{ protocol['Native Token'] || 'Not specified' }}
              </p>
            </div>

            <!-- Founded -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Founded
              </h4>
              <p class="text-[13px] text-gray-900 dark:text-white">
                {{ protocol.Founded || 'Not specified' }}
              </p>
            </div>

            <!-- Type -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Type
              </h4>
              <p class="text-[13px] text-gray-900 dark:text-white">
                {{ protocol.Type || 'Not specified' }}
              </p>
            </div>
          </div>

          <!-- Additional Info -->
          <div
            v-if="protocol.Category"
            class="space-y-2"
          >
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Category
            </h4>
            <p class="text-[13px] text-gray-900 dark:text-white">
              {{ protocol.Category }}
            </p>
          </div>
        </div>
      </div>

      <!-- Fixed Footer -->
      <div
        v-if="protocol?.Link"
        class="border-t border-gray-200 p-6 dark:border-gray-700"
      >
        <a
          :href="protocol.Link"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex w-full items-center justify-center rounded bg-[#f5f5f5] px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#00000020] dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Visit project
        </a>
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
