<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6">
    <h3 class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
      Layer 2 Investments
    </h3>
    <div class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
      ${{ formatNumber(totalFunding) }}
    </div>

    <!-- No Data State -->
    <div
      v-if="!hasData"
      class="flex h-24 items-center justify-center text-sm text-gray-400"
    >
      No data
    </div>

    <!-- Chart -->
    <div
      v-else
      class="relative h-24 w-full"
    >
      <svg
        viewBox="0 0 400 100"
        class="size-full"
        preserveAspectRatio="none"
      >
        <!-- Bars -->
        <rect
          v-for="(bar, index) in chartData"
          :key="bar.year"
          :x="bar.x"
          :y="bar.y"
          :width="barWidth"
          :height="bar.height"
          :rx="4"
          :ry="4"
          :fill="bar.isHovered ? '#f97316' : '#e5e7eb'"
          class="cursor-pointer transition-colors duration-200"
          @mouseenter="hoverBar(index)"
          @mouseleave="unhoverBar(index)"
        />

        <!-- Year Labels -->
        <text
          v-for="bar in chartData"
          :key="`label-${bar.year}`"
          :x="bar.x + barWidth / 2"
          :y="chartHeight - 8"
          text-anchor="middle"
          class="fill-gray-500"
          font-size="12"
        >
          {{ bar.year }}
        </text>
      </svg>

      <!-- Tooltip -->
      <div
        v-if="hoveredBar"
        class="pointer-events-none absolute z-10 rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-lg"
        :style="tooltipStyle"
      >
        ${{ formatNumber(hoveredBar.amount) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import fundingData from '@/assets/data/funding-rounds.json';

// Chart dimensions (using viewBox coordinates)
const chartHeight = 100;
const barWidth = 60;
const barSpacing = 20;
const padding = 20;

// State
const hoveredBarIndex = ref(-1);

// Process funding data
const fundingByYear = computed(() => {
  const yearTotals = {};

  fundingData.forEach((project) => {
    project.FundingRounds.forEach((round) => {
      // Skip if amount is unknown or not a valid number
      if (round.Amount && round.Amount !== 'Unknown' && !Number.isNaN(parseFloat(round.Amount.replace(/,/g, '')))) {
        const year = round.Year;
        const amount = parseFloat(round.Amount.replace(/,/g, ''));

        if (yearTotals[year]) {
          yearTotals[year] += amount;
        } else {
          yearTotals[year] = amount;
        }
      }
    });
  });

  return yearTotals;
});

// Get last 5 years with data
const lastFiveYears = computed(() => {
  const years = Object.keys(fundingByYear.value)
    .map((year) => parseInt(year, 10))
    .filter((year) => !Number.isNaN(year))
    .sort((a, b) => b - a) // Sort descending (newest first)
    .slice(0, 5) // Take last 5 years
    .sort((a, b) => a - b); // Sort ascending for display

  return years;
});

// Chart data
const chartData = computed(() => {
  if (lastFiveYears.value.length === 0) return [];

  const maxAmount = Math.max(...lastFiveYears.value.map((year) => fundingByYear.value[year]));

  return lastFiveYears.value.map((year, index) => {
    const amount = fundingByYear.value[year];
    const height = (amount / maxAmount) * (chartHeight - 30); // Leave space for labels
    const x = index * (barWidth + barSpacing) + padding;
    const y = chartHeight - height - 25; // Leave space for labels

    return {
      year: year.toString(),
      amount,
      x,
      y,
      height,
      isHovered: hoveredBarIndex.value === index,
    };
  });
});

// Check if we have data
const hasData = computed(() => lastFiveYears.value.length > 0);

// Total funding across all years
const totalFunding = computed(() => Object.values(fundingByYear.value).reduce((sum, amount) => sum + amount, 0));

// Hovered bar
const hoveredBar = computed(() => {
  if (hoveredBarIndex.value >= 0 && chartData.value[hoveredBarIndex.value]) {
    return chartData.value[hoveredBarIndex.value];
  }
  return null;
});

// Tooltip position
const tooltipStyle = computed(() => {
  if (!hoveredBar.value) return {};

  // Convert viewBox coordinates to percentage for responsive positioning
  const viewBoxWidth = 400;
  const viewBoxHeight = 100;

  const xPercent = (hoveredBar.value.x / viewBoxWidth) * 100;
  const yPercent = (hoveredBar.value.y / viewBoxHeight) * 100;

  return {
    left: `${xPercent}%`,
    top: `${yPercent}%`,
    transform: 'translate(-100%, -100%)',
  };
});

// Methods
const hoverBar = (index) => {
  hoveredBarIndex.value = index;
};

const unhoverBar = () => {
  hoveredBarIndex.value = -1;
};

const formatNumber = (num) => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  } if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};
</script>
