/**
 * CSV Import Hook for Website
 *
 * Adapted version of the extension's CSV import hook for use in the Next.js website.
 * Uses React state and localStorage instead of Chrome storage API.
 */

import { useState, useRef, useEffect } from "react";
import type { ColumnMapping, SavedMapping } from "@raffle-spinner/types";
// Competition type should be imported from the app using this hook

// Enhanced CSV parsing that detects delimiter
function parseCSV(text: string): string[][] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line);
  if (lines.length === 0) return [];

  // Detect delimiter by checking first line
  const firstLine = lines[0];
  let delimiter = ",";

  // Count occurrences of common delimiters (excluding those within quotes)
  let inQuotes = false;
  let commaCount = 0;
  let semicolonCount = 0;
  let tabCount = 0;

  for (let i = 0; i < firstLine.length; i++) {
    const char = firstLine[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (!inQuotes) {
      if (char === ",") commaCount++;
      else if (char === ";") semicolonCount++;
      else if (char === "\t") tabCount++;
    }
  }

  // Choose the most frequent delimiter
  if (semicolonCount > commaCount && semicolonCount > tabCount) {
    delimiter = ";";
  } else if (tabCount > commaCount && tabCount > semicolonCount) {
    delimiter = "\t";
  }

  return lines.map((line) => {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Handle escaped quotes
          current += '"';
          i++; // Skip the next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    // Add the last field
    result.push(current.trim());

    // Debug first line parsing
    // if (lineIndex === 0) {
    //   console.log('First line parsed:', result);
    // }

    return result;
  });
}

function detectColumnMapping(headers: string[]): Partial<ColumnMapping> {
  const mapping: Partial<ColumnMapping> = {};

  headers.forEach((header) => {
    const lower = header.toLowerCase();

    if (lower.includes("first") && lower.includes("name")) {
      mapping.firstName = header;
    } else if (lower.includes("last") && lower.includes("name")) {
      mapping.lastName = header;
    } else if (
      lower === "name" ||
      lower === "full name" ||
      lower === "fullname"
    ) {
      mapping.fullName = header;
    } else if (
      lower.includes("ticket") ||
      lower.includes("number") ||
      lower === "no" ||
      lower === "#"
    ) {
      mapping.ticketNumber = header;
    }
  });

  return mapping;
}

interface UseCSVImportProps<T = any> {
  addCompetition: (competition: T) => Promise<void>;
  columnMapping: ColumnMapping | null;
  updateColumnMapping: (mapping: ColumnMapping) => void;
}

export function useCSVImport<T = any>({
  addCompetition,
  columnMapping,
  updateColumnMapping,
}: UseCSVImportProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [savedMappings, setSavedMappings] = useState<SavedMapping[]>([]);
  const [suggestedMappingId, setSuggestedMappingId] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showMapperModal, setShowMapperModal] = useState(false);

  // Debug modal state changes
  useEffect(() => {}, [showMapperModal]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [detectedMapping, setDetectedMapping] = useState<
    Partial<ColumnMapping>
  >({});
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

  // Monitor detected headers changes
  useEffect(() => {}, [detectedHeaders]);

  // Load saved mappings from localStorage
  useEffect(() => {
    const loadSavedMappings = () => {
      try {
        const stored = localStorage.getItem("savedMappings");
        if (stored) {
          setSavedMappings(JSON.parse(stored));
        }
      } catch (error) {
        // Ignore parse errors for saved mappings
      }
    };

    loadSavedMappings();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "savedMappings" && e.newValue) {
        try {
          setSavedMappings(JSON.parse(e.newValue));
        } catch (error) {
          // Ignore parse errors for saved mappings
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const detectColumns = async (file: File) => {
    const text = await file.text();

    // Parse the entire CSV to get proper headers
    const parsedData = parseCSV(text);

    if (parsedData.length === 0) {
      throw new Error("CSV file is empty");
    }

    // Get the headers from the first row
    const headers = parsedData[0] || [];

    // Filter out empty headers
    const cleanHeaders = headers.filter((h) => h && h.trim());

    // Use the detection function from csv-parser
    const detected = detectColumnMapping(cleanHeaders);

    return { headers: cleanHeaders, detected };
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
      const matchingMapping = savedMappings.find((m) => {
        const mappingHeaders = Object.values(m.mapping).filter(Boolean);
        return mappingHeaders.every((h) => headers.includes(h as string));
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
      setImportSummary({
        success: false,
        message: "Failed to read CSV file",
      });
    }
  };

  const handleNameConfirm = (name: string) => {
    setCompetitionName(name);
    setShowNameModal(false);
    // Small delay to ensure state updates are processed
    setTimeout(() => {
      setShowMapperModal(true);
    }, 100);
  };

  const handleMappingConfirm = async (
    mapping: ColumnMapping,
    _saveMapping?: SavedMapping,
  ) => {
    if (!selectedFile) return;

    try {
      // Save the mapping for future use
      updateColumnMapping(mapping);

      // Parse the CSV with the confirmed mapping
      const text = await selectedFile.text();
      const rows = parseCSV(text);

      if (rows.length < 2) {
        throw new Error("CSV file has no data rows");
      }

      // Skip header row and process data
      const headerRow = rows[0];

      const participants = rows
        .slice(1)
        .map((row) => {
          const firstName = mapping.firstName
            ? row[headerRow.indexOf(mapping.firstName)]
            : "";
          const lastName = mapping.lastName
            ? row[headerRow.indexOf(mapping.lastName)]
            : "";
          const fullName = mapping.fullName
            ? row[headerRow.indexOf(mapping.fullName)]
            : "";
          const ticketNumber = mapping.ticketNumber
            ? row[headerRow.indexOf(mapping.ticketNumber)]
            : "";

          // If using fullName, split it
          let finalFirstName = firstName;
          let finalLastName = lastName;

          if (!firstName && !lastName && fullName) {
            const parts = fullName.trim().split(/\s+/);
            finalFirstName = parts[0] || "";
            finalLastName = parts.slice(1).join(" ") || "";
          }

          return {
            firstName: finalFirstName,
            lastName: finalLastName,
            ticketNumber: ticketNumber,
          };
        })
        .filter((p) => p.ticketNumber); // Filter out entries without ticket numbers

      // Check for non-numeric ticket numbers that need conversion
      const needsConversion = participants.filter((p) => {
        // Check if ticket number contains non-numeric characters
        const hasNonNumeric = p.ticketNumber && !/^\d+$/.test(p.ticketNumber);
        return hasNonNumeric;
      });

      if (needsConversion.length > 0) {
        // Convert ticket numbers by extracting only digits
        const conversions = needsConversion.map((p) => ({
          original: p.ticketNumber,
          converted: p.ticketNumber.replace(/\D/g, "") || null,
          firstName: p.firstName,
          lastName: p.lastName,
        }));

        // Always show the conversion modal when there are non-numeric tickets
        // This gives users visibility into what's being converted
        setTicketConversions(conversions);
        setShowMapperModal(false);
        setShowConversionModal(true);
        return;
      }

      // Check for duplicates
      const ticketMap = new Map<string, string[]>();
      participants.forEach((p) => {
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
      setShowMapperModal(false);
    } catch (error) {
      setImportSummary({
        success: false,
        message: "Failed to process CSV file",
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
      const participants = rows
        .slice(1)
        .map((row) => {
          const firstName = columnMapping.firstName
            ? row[detectedHeaders.indexOf(columnMapping.firstName)]
            : "";
          const lastName = columnMapping.lastName
            ? row[detectedHeaders.indexOf(columnMapping.lastName)]
            : "";
          const fullName = columnMapping.fullName
            ? row[detectedHeaders.indexOf(columnMapping.fullName)]
            : "";
          const ticketNumber = columnMapping.ticketNumber
            ? row[detectedHeaders.indexOf(columnMapping.ticketNumber)]
            : "";

          // If using fullName, split it
          let finalFirstName = firstName;
          let finalLastName = lastName;

          if (!firstName && !lastName && fullName) {
            const parts = fullName.trim().split(/\s+/);
            finalFirstName = parts[0] || "";
            finalLastName = parts.slice(1).join(" ") || "";
          }

          return {
            firstName: finalFirstName,
            lastName: finalLastName,
            ticketNumber: ticketNumber,
          };
        })
        .filter((p) => {
          if (!p.ticketNumber || seen.has(p.ticketNumber)) {
            return false;
          }
          seen.add(p.ticketNumber);
          return true;
        });

      await createAndSaveCompetition(participants);
      setShowDuplicateModal(false);
      setShowMapperModal(false);
    } catch (error) {
      setImportSummary({
        success: false,
        message: "Failed to process CSV file",
      });
      setShowDuplicateModal(false);
    }
  };

  const handleConversionProceed = async () => {
    // Filter out invalid conversions (those with no numeric characters)
    const validParticipants = ticketConversions
      .filter((c) => c.converted !== null && c.converted !== "")
      .map((c) => ({
        firstName: c.firstName,
        lastName: c.lastName,
        ticketNumber: c.converted as string,
      }));

    if (validParticipants.length === 0) {
      setImportSummary({
        success: false,
        message: "No valid participants found after conversion",
      });
      setShowConversionModal(false);
      return;
    }

    // Check for duplicates after conversion
    const ticketMap = new Map<string, string[]>();
    validParticipants.forEach((p) => {
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
      setShowConversionModal(false);
      setShowDuplicateModal(true);
      return;
    }

    await createAndSaveCompetition(validParticipants);
    setShowConversionModal(false);
    setShowMapperModal(false);
  };

  const createAndSaveCompetition = async (participants: any[]) => {
    try {
      const competition: any = {
        id: `comp-${Date.now()}`,
        name: competitionName,
        participants,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await addCompetition(competition);

      setImportSummary({
        success: true,
        message: `Successfully imported ${participants.length} participants into "${competitionName}"`,
      });

      // Reset form
      setSelectedFile(null);
      setCompetitionName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setImportSummary({
        success: false,
        message: "Failed to create competition",
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
