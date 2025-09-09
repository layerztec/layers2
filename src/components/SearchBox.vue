<script setup>
import { ref, watch } from 'vue';

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search projects...',
  },
});

// Emits
const emit = defineEmits(['update:modelValue']);

// Local ref for the input value
const searchValue = ref(props.modelValue);

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue;
});

// Watch for internal changes and emit to parent
watch(searchValue, (newValue) => {
  emit('update:modelValue', newValue);
});

// Clear search function
const clearSearch = () => {
  searchValue.value = '';
};
</script>

<template>
  <div class="sticky top-[70px] z-40 flex h-[70px] items-center border-b border-[#e0e0e0] bg-white px-4 lg:px-6">
    <div class="relative w-full">
      <input
        v-model="searchValue"
        type="text"
        :placeholder="placeholder"
        class="w-full pr-8 text-[15px] font-semibold text-[#a4a4a4] placeholder:text-[#a4a4a4] focus:text-[#333333] focus:outline-none"
      >

      <!-- Clear Button -->
      <button
        v-if="searchValue.length > 0"
        type="button"
        class="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[#a4a4a4] transition-colors hover:text-[#333333]"
        @click="clearSearch"
      >
        <svg
          class="size-4"
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
  </div>
</template>
