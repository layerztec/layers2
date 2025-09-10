// GitHub Pages SPA redirect script
// This handles client-side routing for GitHub Pages
(function() {
  // Only run on GitHub Pages (not localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return;
  }

  // Check if we're on a 404 page
  if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/index.html')) {
    // Redirect to index.html with the path as a query parameter
    const path = window.location.pathname + window.location.search + window.location.hash;
    window.location.replace('/?/' + path.slice(1));
  }
})();
