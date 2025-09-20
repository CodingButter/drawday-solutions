// Helper to clear localStorage when quota is exceeded
export const clearLargeStorageItems = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear theme from localStorage since we now use Directus only
    localStorage.removeItem('theme');
    
    // Clear any other large items that might cause quota issues
    const keysToCheck = ['competitions', 'settings', 'columnMapping'];
    
    keysToCheck.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item && item.length > 100000) { // If item is larger than 100KB
          localStorage.removeItem(key);
        }
      } catch (e) {
      }
    });
    
  } catch (error) {
  }
};

// Run this on page load to fix any existing quota issues
if (typeof window !== 'undefined') {
  clearLargeStorageItems();
}