const http = require('http');

const pages = [
  { path: '/', name: 'Homepage' },
  { path: '/register', name: 'Registration' },
  { path: '/login', name: 'Login' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/configuration', name: 'Configuration' },
  { path: '/live-spinner', name: 'Live Spinner' },
];

console.log('Testing website pages on http://localhost:3001\n');

pages.forEach((page) => {
  http
    .get(`http://localhost:3001${page.path}`, (res) => {
      console.log(`✓ ${page.name} (${page.path}): Status ${res.statusCode}`);
    })
    .on('error', (err) => {
      console.log(`✗ ${page.name} (${page.path}): ${err.message}`);
    });
});
