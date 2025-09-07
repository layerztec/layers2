<template>
  <div class="border-b border-[#e0e0e0] bg-white p-3 lg:hidden">
    <div class="grid grid-cols-1 gap-2">
      <!-- Type Filter -->
      <select
        :value="selectedType"
        class="w-full rounded bg-[#f5f5f5] p-2 text-[12px] font-semibold text-[#333333] focus:outline-none"
        @change="$emit('update:selectedType', $event.target.value)"
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
        :value="selectedCategory"
        class="w-full rounded bg-[#f5f5f5] p-2 text-[12px] font-semibold text-[#333333] focus:outline-none"
        @change="$emit('update:selectedCategory', $event.target.value)"
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
        :value="selectedNetworkStage"
        class="w-full rounded bg-[#f5f5f5] p-2 text-[12px] font-semibold text-[#333333] focus:outline-none"
        @change="$emit('update:selectedNetworkStage', $event.target.value)"
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
