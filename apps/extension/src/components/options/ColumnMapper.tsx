/**
 * Column Mapper Component
 *
 * Purpose: Modal interface for mapping CSV column headers to required data fields
 * (First Name, Last Name, Ticket Number) with auto-detection and manual override.
 *
 * SRS Reference:
 * - FR-1.4: Column Mapping Interface
 * - FR-1.5: Data Validation and Error Handling
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@raffle-spinner/ui';
import { Button } from '@raffle-spinner/ui';
import { Label } from '@raffle-spinner/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@raffle-spinner/ui';
import { ColumnMapping, SavedMapping, storage } from '@raffle-spinner/storage';
import { Input } from '@raffle-spinner/ui';
import { Checkbox } from '@raffle-spinner/ui';
import { Alert, AlertDescription } from '@raffle-spinner/ui';
import { InfoIcon } from 'lucide-react';
import { InfoTooltip } from '@raffle-spinner/ui';
import { helpContent } from '@/lib/help-content';

interface ColumnMapperProps {
  open: boolean;
  onClose: () => void;
  headers: string[];
  detectedMapping: Partial<ColumnMapping>;
  onConfirm: (mapping: ColumnMapping, saveMapping?: SavedMapping) => void;
  savedMappings?: SavedMapping[];
  suggestedMappingId?: string;
}

export function ColumnMapper({
  open,
  onClose,
  headers,
  detectedMapping,
  onConfirm,
  savedMappings = [],
  suggestedMappingId,
}: ColumnMapperProps) {
  console.log('ColumnMapper component rendering');
  console.log('ColumnMapper - props:', { open, headers, detectedMapping });
  console.log('ColumnMapper - headers received:', headers);
  console.log('ColumnMapper - headers length:', headers.length);
  console.log('ColumnMapper - headers type:', typeof headers);
  console.log('ColumnMapper - headers is array:', Array.isArray(headers));
  
  if (headers.length > 0) {
    console.log('ColumnMapper - first header:', headers[0]);
    console.log('ColumnMapper - all headers:', headers.map((h, i) => `[${i}]: "${h}"`).join(', '));
  } else {
    console.log('ColumnMapper - No headers or empty array!');
  }
  
  // Validate that detected mapping values exist in headers
  const validateMapping = (mappingToValidate: Partial<ColumnMapping>): Partial<ColumnMapping> => {
    const validated: Partial<ColumnMapping> = {};
    
    if (mappingToValidate.firstName && headers.includes(mappingToValidate.firstName)) {
      validated.firstName = mappingToValidate.firstName;
    }
    if (mappingToValidate.lastName && headers.includes(mappingToValidate.lastName)) {
      validated.lastName = mappingToValidate.lastName;
    }
    if (mappingToValidate.fullName && headers.includes(mappingToValidate.fullName)) {
      validated.fullName = mappingToValidate.fullName;
    }
    if (mappingToValidate.ticketNumber && headers.includes(mappingToValidate.ticketNumber)) {
      validated.ticketNumber = mappingToValidate.ticketNumber;
    }
    
    return validated;
  };
  
  const validatedMapping = validateMapping(detectedMapping);
  
  const [mapping, setMapping] = React.useState<Partial<ColumnMapping>>(validatedMapping);
  const [useFullName, setUseFullName] = React.useState<boolean>(
    !!validatedMapping.fullName || (!validatedMapping.firstName && !validatedMapping.lastName)
  );
  const [shouldSaveMapping, setShouldSaveMapping] = React.useState(false);
  const [mappingName, setMappingName] = React.useState('');
  const [selectedSavedMappingId, setSelectedSavedMappingId] = React.useState<string>('');

  // Track if modal just opened
  const [hasInitialized, setHasInitialized] = React.useState(false);
  
  React.useEffect(() => {
    if (open && !hasInitialized) {
      console.log('ColumnMapper - Modal opened for first time, initializing mapping');
      console.log('ColumnMapper - detectedMapping:', detectedMapping);
      console.log('ColumnMapper - suggestedMappingId:', suggestedMappingId);
      setHasInitialized(true);
    }
    
    if (!open) {
      // Reset initialization when modal closes
      setHasInitialized(false);
    }
  }, [open, hasInitialized, detectedMapping, suggestedMappingId]);

  React.useEffect(() => {
    console.log('ColumnMapper - useEffect triggered, headers:', headers);
    console.log('ColumnMapper - detectedMapping:', detectedMapping);
    console.log('ColumnMapper - suggestedMappingId:', suggestedMappingId);
    
    // Only process if we have headers
    if (!headers || headers.length === 0) {
      console.log('ColumnMapper - No headers available, skipping mapping');
      return;
    }
    
    // If we have a suggested mapping, validate and use it
    if (suggestedMappingId && savedMappings.length > 0) {
      const suggested = savedMappings.find((m) => m.id === suggestedMappingId);
      if (suggested) {
        const validatedSuggested = validateMapping(suggested.mapping);
        console.log('ColumnMapper - Using suggested mapping:', validatedSuggested);
        setMapping(validatedSuggested);
        setUseFullName(!!validatedSuggested.fullName);
        setSelectedSavedMappingId(suggestedMappingId);
        return;
      }
    }

    // Otherwise use validated detected mapping
    const validated = validateMapping(detectedMapping);
    console.log('ColumnMapper - Using validated detected mapping:', validated);
    setMapping(validated);
    setUseFullName(
      !!validated.fullName || (!validated.firstName && !validated.lastName)
    );
  }, [detectedMapping, suggestedMappingId, savedMappings, headers]);

  const handleConfirm = async () => {
    const finalMapping = useFullName
      ? { fullName: mapping.fullName, ticketNumber: mapping.ticketNumber }
      : {
          firstName: mapping.firstName,
          lastName: mapping.lastName,
          ticketNumber: mapping.ticketNumber,
        };

    if (
      (useFullName && finalMapping.fullName && finalMapping.ticketNumber) ||
      (!useFullName && finalMapping.firstName && finalMapping.lastName && finalMapping.ticketNumber)
    ) {
      let savedMapping: SavedMapping | undefined;

      if (shouldSaveMapping && mappingName.trim()) {
        savedMapping = {
          id: `mapping-${Date.now()}`,
          name: mappingName.trim(),
          mapping: finalMapping as ColumnMapping,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          usageCount: 1,
          isDefault: false,
        };
        await storage.saveSavedMapping(savedMapping);
      } else if (selectedSavedMappingId) {
        // Increment usage count of existing mapping
        const existing = savedMappings.find((m) => m.id === selectedSavedMappingId);
        if (existing) {
          await storage.saveSavedMapping({
            ...existing,
            usageCount: existing.usageCount + 1,
          });
        }
      }

      onConfirm(finalMapping as ColumnMapping, savedMapping);
    }
  };

  const handleSelectSavedMapping = (mappingId: string) => {
    if (mappingId === 'manual') {
      // Reset to manual configuration
      setSelectedSavedMappingId('');
      setShouldSaveMapping(false);
      // Keep current mapping or use validated detected mapping
      const validated = validateMapping(detectedMapping);
      setMapping(validated);
      setUseFullName(
        !!validated.fullName || (!validated.firstName && !validated.lastName)
      );
    } else {
      const saved = savedMappings.find((m) => m.id === mappingId);
      if (saved) {
        const validated = validateMapping(saved.mapping);
        setMapping(validated);
        setUseFullName(!!validated.fullName);
        setSelectedSavedMappingId(mappingId);
        setShouldSaveMapping(false);
      }
    }
  };

  React.useEffect(() => {
    console.log('ColumnMapper - mapping state updated:', mapping);
  }, [mapping]);
  
  // Filter headers to ensure they're not empty
  const filteredHeaders = headers.filter(h => h && h.trim());
  console.log('ColumnMapper - filtered headers:', filteredHeaders);
  
  const isValid = useFullName
    ? mapping.fullName && mapping.ticketNumber
    : mapping.firstName && mapping.lastName && mapping.ticketNumber;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Map CSV Columns
            <InfoTooltip {...helpContent.columnMapping.overview} />
          </DialogTitle>
          <DialogDescription>
            Select which columns in your CSV correspond to the required fields.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Saved Mappings Selector */}
          {savedMappings.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="savedMapping">Use Saved Mapping</Label>
              <Select
                value={selectedSavedMappingId || 'manual'}
                onValueChange={handleSelectSavedMapping}
              >
                <SelectTrigger id="savedMapping">
                  <SelectValue placeholder="Select a saved mapping or configure manually" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Configure manually</SelectItem>
                  {savedMappings.map((saved) => (
                    <SelectItem key={saved.id} value={saved.id}>
                      {saved.name} {saved.isDefault && '(Default)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {suggestedMappingId && selectedSavedMappingId === suggestedMappingId && (
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    This mapping was automatically selected based on your default or most recently
                    used settings.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          {/* Toggle between full name and separate name columns */}
          <div className="flex items-center space-x-2 pb-2 border-b">
            <input
              type="radio"
              id="separateNames"
              name="nameFormat"
              checked={!useFullName}
              onChange={() => {
                setUseFullName(false);
                setMapping({ ...mapping, fullName: undefined });
              }}
              className="h-4 w-4"
            />
            <Label htmlFor="separateNames" className="font-normal cursor-pointer">
              Separate first and last name columns
            </Label>
          </div>

          <div className="flex items-center space-x-2 pb-2 border-b">
            <input
              type="radio"
              id="fullName"
              name="nameFormat"
              checked={useFullName}
              onChange={() => {
                setUseFullName(true);
                setMapping({ ...mapping, firstName: undefined, lastName: undefined });
              }}
              className="h-4 w-4"
            />
            <Label htmlFor="fullName" className="font-normal cursor-pointer">
              Single column with full names
            </Label>
          </div>

          {/* Show appropriate fields based on selection */}
          {useFullName ? (
            <div className="space-y-2">
              <Label htmlFor="fullNameColumn">Full Name Column</Label>
              <Select
                value={mapping.fullName || ''}
                onValueChange={(value) => setMapping({ ...mapping, fullName: value })}
              >
                <SelectTrigger id="fullNameColumn">
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  {filteredHeaders.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Names will be automatically split. Supports &quot;First Last&quot;, &quot;Last,
                First&quot;, and multi-word names.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name Column</Label>
                <Select
                  value={mapping.firstName || ''}
                  onValueChange={(value) => setMapping({ ...mapping, firstName: value })}
                >
                  <SelectTrigger id="firstName">
                    <SelectValue placeholder="Select a column" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredHeaders.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name Column</Label>
                <Select
                  value={mapping.lastName || ''}
                  onValueChange={(value) => setMapping({ ...mapping, lastName: value })}
                >
                  <SelectTrigger id="lastName">
                    <SelectValue placeholder="Select a column" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredHeaders.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="ticketNumber">Ticket Number Column</Label>
            <Select
              value={mapping.ticketNumber || ''}
              onValueChange={(value) => setMapping({ ...mapping, ticketNumber: value })}
            >
              <SelectTrigger id="ticketNumber">
                <SelectValue placeholder="Select a column" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Save Mapping Option */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="saveMapping"
                checked={shouldSaveMapping}
                onCheckedChange={(checked) => setShouldSaveMapping(checked as boolean)}
                disabled={!!selectedSavedMappingId}
              />
              <Label htmlFor="saveMapping" className="font-normal cursor-pointer">
                Save this mapping for future use
              </Label>
            </div>
            {shouldSaveMapping && (
              <Input
                placeholder="Enter a name for this mapping (e.g., 'Standard Format')"
                value={mappingName}
                onChange={(e) => setMappingName(e.target.value)}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid || (shouldSaveMapping && !mappingName.trim())}
          >
            Confirm Mapping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
