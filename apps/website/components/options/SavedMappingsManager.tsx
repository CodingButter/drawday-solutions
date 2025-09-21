/**
 * Saved Mappings Manager Component (Website Version)
 *
 * Purpose: Wrapper component to display saved CSV column mappings
 * from Directus in the options page. This component doesn't handle
 * the saving/loading logic as that's done in the main options page
 * via the SavedMappings component when CSV upload is active.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { SavedMappings } from '../csv/SavedMappings';

export function SavedMappingsManager() {
  const [currentMapping, setCurrentMapping] = useState<Record<string, string>>({});

  // This component is just for display in the saved mappings section
  // The actual functionality is handled by SavedMappings component
  // when integrated with CSV upload

  const handleLoadMapping = (mapping: Record<string, string>) => {
    setCurrentMapping(mapping);
    // In practice, this would be handled by the parent options page
    console.log('Loaded mapping:', mapping);
  };

  const handleSaveMapping = (name: string, description?: string, isDefault?: boolean) => {
    console.log('Saved mapping:', { name, description, isDefault });
    // In practice, this would be handled by the parent options page
  };

  return (
    <SavedMappings
      currentMapping={currentMapping}
      onLoadMapping={handleLoadMapping}
      onSaveMapping={handleSaveMapping}
    />
  );
}
