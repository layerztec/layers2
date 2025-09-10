/**
 * Convert a project name to a URL-friendly slug
 * @param {string} name - The project name
 * @returns {string} - The slugified version (kebab-case)
 */
export function createSlug(name) {
  if (!name) return '';

  // Handle specific edge cases first
  const specialCases = {
    'RGB++': 'rgb-plus-plus',
    RGB: 'rgb',
    'BRC-20': 'brc-20',
    // Add more special cases as needed
  };

  if (specialCases[name]) {
    return specialCases[name];
  }

  return name
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens and alphanumeric
    .replace(/[^a-z0-9-]/g, '')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Find a project by its slug
 * @param {Array} projects - Array of project objects
 * @param {string} slug - The slug to search for
 * @returns {Object|null} - The matching project or null
 */
export function findProjectBySlug(projects, slug) {
  if (!projects || !slug) return null;

  return projects.find((project) => createSlug(project.Name) === slug);
}
