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
</script>

<template>
  <div class="sticky top-[70px] z-40 flex h-[70px] items-center border-b border-[#e0e0e0] bg-white px-4 lg:px-6">
    <input
      v-model="searchValue"
      type="text"
      :placeholder="placeholder"
      class="w-full text-[15px] font-semibold text-[#a4a4a4] placeholder:text-[#a4a4a4] focus:text-[#333333] focus:outline-none"
    >
  </div>
</template>
