<template>
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
            'flex cursor-pointer items-center justify-between rounded px-2 py-1 text-[13px] font-semibold transition-colors',
            selectedType === type
              ? 'bg-[#f5f5f5] text-[#333333]'
              : 'text-[#333333] hover:bg-gray-50'
          ]"
          @click="$emit('update:selectedType', selectedType === type ? '' : type)"
        >
          <span>{{ type }}</span>
          <span
            v-if="selectedType === type"
            class="text-[#333333]"
          >✓</span>
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
            'flex cursor-pointer items-center justify-between rounded px-2 py-1 text-[13px] font-semibold transition-colors',
            selectedCategory === category
              ? 'bg-[#f5f5f5] text-[#333333]'
              : 'text-[#333333] hover:bg-gray-50'
          ]"
          @click="$emit('update:selectedCategory', selectedCategory === category ? '' : category)"
        >
          <span>{{ category }}</span>
          <span
            v-if="selectedCategory === category"
            class="text-[#333333]"
          >✓</span>
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
            'flex cursor-pointer items-center justify-between rounded px-2 py-1 text-[13px] font-semibold transition-colors',
            selectedNetworkStage === stage
              ? 'bg-[#f5f5f5] text-[#333333]'
              : 'text-[#333333] hover:bg-gray-50'
          ]"
          @click="$emit('update:selectedNetworkStage', selectedNetworkStage === stage ? '' : stage)"
        >
          <span>{{ stage }}</span>
          <span
            v-if="selectedNetworkStage === stage"
            class="text-[#333333]"
          >✓</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  types: {
    type: Array,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  networkStages: {
    type: Array,
    required: true,
  },
  selectedType: {
    type: String,
    default: '',
  },
  selectedCategory: {
    type: String,
    default: '',
  },
  selectedNetworkStage: {
    type: String,
    default: '',
  },
});

defineEmits([
  'update:selectedType',
  'update:selectedCategory',
  'update:selectedNetworkStage',
]);
</script>
