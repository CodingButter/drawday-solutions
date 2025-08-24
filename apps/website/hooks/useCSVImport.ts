/**
 * CSV Import Hook for Website
 * 
 * Adapted version of the extension's CSV import hook for use in the Next.js website.
 * Uses React state and localStorage instead of Chrome storage API.
 */

import { useState, useRef, useEffect } from "react";
import type { Competition } from "@/contexts";
import { createCompetition } from '@/lib/firebase-service';

// Simple CSV parsing for the website
function parseCSV(text: string): string[][] {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  return lines.map(line => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  });
}

function detectColumnMapping(headers: string[]): Partial<ColumnMapping> {
  const mapping: Partial<ColumnMapping> = {};
  
  headers.forEach((header, index) => {
    const lower = header.toLowerCase();
    
    if (lower.includes('first') && lower.includes('name')) {
      mapping.firstName = header;
    } else if (lower.includes('last') && lower.includes('name')) {
      mapping.lastName = header;
    } else if (lower === 'name' || lower === 'full name' || lower === 'fullname') {
      mapping.fullName = header;
    } else if (lower.includes('ticket') || lower.includes('number') || lower === 'no' || lower === '#') {
      mapping.ticketNumber = header;
    }
  });
  
  return mapping;
}

interface ColumnMapping {
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  ticketNumber: string | null;
}

interface SavedMapping {
  id: string;
  name: string;
  mapping: ColumnMapping;
}

interface UseCSVImportProps {
  addCompetition: (competition: Competition) => Promise<void>;
  columnMapping: ColumnMapping | null;
  updateColumnMapping: (mapping: ColumnMapping) => void;
}

export function useCSVImport({
  addCompetition,
  columnMapping,
  updateColumnMapping,
}: UseCSVImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [savedMappings, setSavedMappings] = useState<SavedMapping[]>([]);
  const [suggestedMappingId, setSuggestedMappingId] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showMapperModal, setShowMapperModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [detectedMapping, setDetectedMapping] = useState<Partial<ColumnMapping>>({});
  const [duplicates, setDuplicates] = useState<
    Array<{ ticketNumber: string; names: string[] }>
  >([]);
  const [ticketConversions, setTicketConversions] = useState<
    Array<{
      original: string;
      converted: string | null;
      firstName: string;
      lastName: string;
    }>
  >([]);
  const [competitionName, setCompetitionName] = useState("");
  const [importSummary, setImportSummary] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Load saved mappings from localStorage
  useEffect(() => {
    const loadSavedMappings = () => {
      try {
        const stored = localStorage.getItem('savedMappings');
        if (stored) {
          setSavedMappings(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading saved mappings:', error);
      }
    };

    loadSavedMappings();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'savedMappings' && e.newValue) {
        try {
          setSavedMappings(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing saved mappings:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const detectColumns = async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    // Parse the first line to get headers
    const headers = parseCSV(lines[0])[0];
    
    // Use the detection function from csv-parser
    const detected = detectColumnMapping(headers);
    
    return { headers, detected };
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setImportSummary(null);

    try {
      const { headers, detected } = await detectColumns(file);
      setDetectedHeaders(headers);
      setDetectedMapping(detected);

      // Suggest a saved mapping if headers match
      const matchingMapping = savedMappings.find(m => {
        const mappingHeaders = Object.values(m.mapping).filter(Boolean);
        return mappingHeaders.every(h => headers.includes(h as string));
      });

      if (matchingMapping) {
        setSuggestedMappingId(matchingMapping.id);
      }

      // Use previously saved mapping if available
      if (columnMapping) {
        setDetectedMapping(columnMapping);
      }

      setShowNameModal(true);
    } catch (error) {
      console.error('Error detecting columns:', error);
      setImportSummary({
        success: false,
        message: 'Failed to read CSV file',
      });
    }
  };

  const handleNameConfirm = (name: string) => {
    setCompetitionName(name);
    setShowNameModal(false);
    setShowMapperModal(true);
  };

  const handleMappingConfirm = async (mapping: ColumnMapping) => {
    if (!selectedFile) return;

    try {
      // Save the mapping for future use
      updateColumnMapping(mapping);

      // Parse the CSV with the confirmed mapping
      const text = await selectedFile.text();
      const rows = parseCSV(text);
      
      if (rows.length < 2) {
        throw new Error('CSV file has no data rows');
      }

      // Skip header row and process data
      const participants = rows.slice(1).map(row => {
        const firstName = mapping.firstName ? row[detectedHeaders.indexOf(mapping.firstName)] : '';
        const lastName = mapping.lastName ? row[detectedHeaders.indexOf(mapping.lastName)] : '';
        const fullName = mapping.fullName ? row[detectedHeaders.indexOf(mapping.fullName)] : '';
        const ticketNumber = mapping.ticketNumber ? row[detectedHeaders.indexOf(mapping.ticketNumber)] : '';

        // If using fullName, split it
        let finalFirstName = firstName;
        let finalLastName = lastName;
        
        if (!firstName && !lastName && fullName) {
          const parts = fullName.trim().split(/\s+/);
          finalFirstName = parts[0] || '';
          finalLastName = parts.slice(1).join(' ') || '';
        }

        return {
          firstName: finalFirstName,
          lastName: finalLastName,
          ticketNumber: ticketNumber
        };
      }).filter(p => p.ticketNumber); // Filter out entries without ticket numbers

      // Check for duplicates
      const ticketMap = new Map<string, string[]>();
      participants.forEach(p => {
        const key = p.ticketNumber;
        if (!ticketMap.has(key)) {
          ticketMap.set(key, []);
        }
        ticketMap.get(key)!.push(`${p.firstName} ${p.lastName}`);
      });

      const duplicateTickets = Array.from(ticketMap.entries())
        .filter(([_, names]) => names.length > 1)
        .map(([ticketNumber, names]) => ({ ticketNumber, names }));

      if (duplicateTickets.length > 0) {
        setDuplicates(duplicateTickets);
        setShowMapperModal(false);
        setShowDuplicateModal(true);
        return;
      }

      // No duplicates, proceed to create competition
      await createAndSaveCompetition(participants);
    } catch (error) {
      console.error('Error processing CSV:', error);
      setImportSummary({
        success: false,
        message: 'Failed to process CSV file',
      });
      setShowMapperModal(false);
    }
  };

  const handleDuplicateProceed = async () => {
    if (!selectedFile || !columnMapping) return;

    try {
      const text = await selectedFile.text();
      const rows = parseCSV(text);
      
      // Process with duplicates (keeping first occurrence)
      const seen = new Set<string>();
      const participants = rows.slice(1).map(row => {
        const firstName = columnMapping.firstName ? row[detectedHeaders.indexOf(columnMapping.firstName)] : '';
        const lastName = columnMapping.lastName ? row[detectedHeaders.indexOf(columnMapping.lastName)] : '';
        const fullName = columnMapping.fullName ? row[detectedHeaders.indexOf(columnMapping.fullName)] : '';
        const ticketNumber = columnMapping.ticketNumber ? row[detectedHeaders.indexOf(columnMapping.ticketNumber)] : '';

        // If using fullName, split it
        let finalFirstName = firstName;
        let finalLastName = lastName;
        
        if (!firstName && !lastName && fullName) {
          const parts = fullName.trim().split(/\s+/);
          finalFirstName = parts[0] || '';
          finalLastName = parts.slice(1).join(' ') || '';
        }

        return {
          firstName: finalFirstName,
          lastName: finalLastName,
          ticketNumber: ticketNumber
        };
      }).filter(p => {
        if (!p.ticketNumber || seen.has(p.ticketNumber)) {
          return false;
        }
        seen.add(p.ticketNumber);
        return true;
      });

      await createAndSaveCompetition(participants);
      setShowDuplicateModal(false);
    } catch (error) {
      console.error('Error processing CSV with duplicates:', error);
      setImportSummary({
        success: false,
        message: 'Failed to process CSV file',
      });
      setShowDuplicateModal(false);
    }
  };

  const handleConversionProceed = async (conversions: any[]) => {
    // Handle ticket number conversions if needed
    const participants = conversions.map(c => ({
      firstName: c.firstName,
      lastName: c.lastName,
      ticketNumber: c.converted || c.original
    }));

    await createAndSaveCompetition(participants);
    setShowConversionModal(false);
  };

  const createAndSaveCompetition = async (participants: any[]) => {
    try {
      const competition: Competition = {
        id: `comp-${Date.now()}`,
        name: competitionName,
        participants,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await addCompetition(competition);

      setImportSummary({
        success: true,
        message: `Successfully imported ${participants.length} participants into "${competitionName}"`,
      });

      // Reset form
      setSelectedFile(null);
      setCompetitionName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error creating competition:', error);
      setImportSummary({
        success: false,
        message: 'Failed to create competition',
      });
    }
  };

  const openMapperModal = () => {
    setShowMapperModal(true);
  };

  return {
    fileInputRef,
    selectedFile,
    showNameModal,
    showMapperModal,
    showDuplicateModal,
    showConversionModal,
    detectedHeaders,
    detectedMapping,
    duplicates,
    ticketConversions,
    importSummary,
    savedMappings,
    suggestedMappingId,
    handleFileSelect,
    handleMappingConfirm,
    handleNameConfirm,
    handleDuplicateProceed,
    handleConversionProceed,
    setShowNameModal,
    setShowMapperModal,
    setShowDuplicateModal,
    setShowConversionModal,
    openMapperModal,
  };
}