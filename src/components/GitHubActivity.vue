<template>
  <div class="border border-gray-200 bg-white p-6">
    <h3 class="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
      Recent Activity
    </h3>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex h-24 items-center justify-center text-sm text-gray-400"
    >
      Loading...
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex h-24 items-center justify-center text-sm text-gray-400"
    >
      Unable to load activity
    </div>

    <!-- Pull Requests List -->
    <div
      v-else-if="pullRequests.length > 0"
      class="space-y-2"
    >
      <div
        v-for="pr in pullRequests"
        :key="pr.id"
        class="text-sm font-semibold text-gray-900 dark:text-white"
      >
        <div class="line-clamp-2">
          {{ pr.title }}
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div
      v-else
      class="flex h-24 items-center justify-center text-sm text-gray-400"
    >
      No recent activity
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// State
const loading = ref(true);
const error = ref(false);
const pullRequests = ref([]);

// GitHub API configuration
const REPO_OWNER = 'layerztec';
const REPO_NAME = 'layers2';
const CACHE_KEY = 'github-pull-requests';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache management
const getCachedData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (cacheError) {
    // eslint-disable-next-line no-console
    console.warn('Failed to read from cache:', cacheError);
  }
  return null;
};

const setCachedData = (data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (cacheError) {
    // eslint-disable-next-line no-console
    console.warn('Failed to save to cache:', cacheError);
  }
};

// Fetch pull requests from GitHub API
const fetchPullRequests = async () => {
  try {
    loading.value = true;
    error.value = false;

    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      pullRequests.value = cachedData;
      loading.value = false;
      return;
    }

    // Fetch from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=closed&sort=updated&per_page=5`,
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter for merged pull requests
    const mergedPRs = data.filter((pr) => pr.merged_at !== null);

    // Take only the latest 5 merged PRs
    const latestMergedPRs = mergedPRs.slice(0, 5).map((pr) => ({
      id: pr.id,
      title: pr.title,
      number: pr.number,
      merged_at: pr.merged_at,
    }));

    pullRequests.value = latestMergedPRs;

    // Cache the data
    setCachedData(latestMergedPRs);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch pull requests:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// Initialize on mount
onMounted(() => {
  fetchPullRequests();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
