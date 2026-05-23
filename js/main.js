/**
 * AETRAM PLATFORM - Main JavaScript Entry Point
 * Loads core modules and initializes the application
 */

(function() {
  'use strict';

  // Core modules are loaded first (component_loader.js handles dynamic loading)
  console.log('Aetram Platform initialized');

  // Application initialization
  $(document).ready(function() {
    console.log('DOM ready - Aetram Platform bootstrapped');
    
    // Initialize global components if available
    if (typeof AetramToast !== 'undefined') {
      AetramToast.init();
    }
    
    if (typeof AetramLoader !== 'undefined') {
      AetramLoader.init();
    }
    
    if (typeof AetramSession !== 'undefined') {
      // Session management ready
    }
  });

})();