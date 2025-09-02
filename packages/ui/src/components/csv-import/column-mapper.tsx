/**
 * Column Mapper Component
 *
 * Purpose: Modal interface for mapping CSV column headers to required data fields
 * (First Name, Last Name, Ticket Number) with auto-detection and manual override.
 * This is a shared component used by both the extension and website.
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
} from '../dialog';
import { Button } from '../button';
import { Label } from '../label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { Input } from '../input';
import { Checkbox } from '../checkbox';
import { Alert, AlertDescription } from '../alert';
import { InfoIcon } from 'lucide-react';
import type { ColumnMapping, SavedMapping } from '@raffle-spinner/types';

interface ColumnMapperProps {
  open: boolean;
  onClose: () => void;
  headers: string[];
  detectedMapping: Partial<ColumnMapping>;
  onConfirm: (mapping: ColumnMapping, saveMapping?: SavedMapping) => void;
  savedMappings?: SavedMapping[];
  suggestedMappingId?: string;
  onSaveMapping?: (mapping: SavedMapping) => Promise<void>;
}

export function ColumnMapper({
  open,
  onClose,
  headers,
  detectedMapping,
  onConfirm,
  savedMappings = [],
  suggestedMappingId,
  onSaveMapping,
}: ColumnMapperProps) {
  // Ensure headers is always a valid array
  const safeHeaders = React.useMemo(() => {
    if (!headers || !Array.isArray(headers)) {
      return [];
    }
    return headers.filter(h => h && typeof h === 'string' && h.trim());
  }, [headers]);

  // Validate that mapping values exist in headers
  const validateMapping = React.useCallback((mappingToValidate: Partial<ColumnMapping>): Partial<ColumnMapping> => {
    const validated: Partial<ColumnMapping> = {};
    
    if (mappingToValidate.firstName && safeHeaders.includes(mappingToValidate.firstName)) {
      validated.firstName = mappingToValidate.firstName;
    }
    if (mappingToValidate.lastName && safeHeaders.includes(mappingToValidate.lastName)) {
      validated.lastName = mappingToValidate.lastName;
    }
    if (mappingToValidate.fullName && safeHeaders.includes(mappingToValidate.fullName)) {
      validated.fullName = mappingToValidate.fullName;
    }
    if (mappingToValidate.ticketNumber && safeHeaders.includes(mappingToValidate.ticketNumber)) {
      validated.ticketNumber = mappingToValidate.ticketNumber;
    }
    
    return validated;
  }, [safeHeaders]);

  // Initialize with validated mapping
  const initialMapping = React.useMemo(() => {
    const validated = validateMapping(detectedMapping);
    // If no valid mapping found, try to auto-detect from headers
    if (Object.keys(validated).length === 0 && safeHeaders.length > 0) {
      const autoDetected: Partial<ColumnMapping> = {};
      
      safeHeaders.forEach((header) => {
        const lower = header.toLowerCase();
        
        // Detect full name column
        if (!autoDetected.fullName && (
          lower === 'name' || 
          lower === 'full name' || 
          lower === 'fullname' ||
          lower === 'participant'
        )) {
          autoDetected.fullName = header;
        }
        
        // Detect first name
        if (!autoDetected.firstName && (
          lower.includes('first') && lower.includes('name')
        )) {
          autoDetected.firstName = header;
        }
        
        // Detect last name
        if (!autoDetected.lastName && (
          lower.includes('last') && lower.includes('name')
        )) {
          autoDetected.lastName = header;
        }
        
        // Detect ticket number
        if (!autoDetected.ticketNumber && (
          lower.includes('ticket') || 
          lower.includes('number') || 
          lower === 'no' || 
          lower === '#' ||
          lower === 'id' ||
          lower === 'entry'
        )) {
          autoDetected.ticketNumber = header;
        }
      });
      
      return autoDetected;
    }
    return validated;
  }, [detectedMapping, validateMapping, safeHeaders]);

  const [mapping, setMapping] = React.useState<Partial<ColumnMapping>>(initialMapping);
  const [useFullName, setUseFullName] = React.useState<boolean>(
    !!initialMapping.fullName || (!initialMapping.firstName && !initialMapping.lastName)
  );
  const [shouldSaveMapping, setShouldSaveMapping] = React.useState(false);
  const [mappingName, setMappingName] = React.useState('');
  const [selectedSavedMappingId, setSelectedSavedMappingId] = React.useState<string>('');

  // Track if modal just opened
  const [hasInitialized, setHasInitialized] = React.useState(false);

  // Reset when modal opens
  React.useEffect(() => {
    if (open && !hasInitialized) {
      // Re-initialize mapping when modal opens
      
      // If we have a suggested saved mapping, try to use it
      if (suggestedMappingId && savedMappings.length > 0) {
        const suggested = savedMappings.find((m) => m.id === suggestedMappingId);
        if (suggested) {
          const validatedSuggested = validateMapping(suggested.mapping);
          if (Object.keys(validatedSuggested).length > 0) {
            setMapping(validatedSuggested);
            setUseFullName(!!validatedSuggested.fullName);
            setSelectedSavedMappingId(suggestedMappingId);
            setHasInitialized(true);
            return;
          }
        }
      }
      
      // Otherwise use the initial mapping
      setMapping(initialMapping);
      setUseFullName(!!initialMapping.fullName || (!initialMapping.firstName && !initialMapping.lastName));
      setHasInitialized(true);
    }
    
    if (!open) {
      setHasInitialized(false);
      setShouldSaveMapping(false);
      setMappingName('');
    }
  }, [open, hasInitialized, detectedMapping, suggestedMappingId, savedMappings, validateMapping, initialMapping]);

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

      if (shouldSaveMapping && mappingName.trim() && onSaveMapping) {
        savedMapping = {
          id: `mapping-${Date.now()}`,
          name: mappingName.trim(),
          mapping: {
            firstName: finalMapping.firstName || null,
            lastName: finalMapping.lastName || null,
            fullName: finalMapping.fullName || null,
            ticketNumber: finalMapping.ticketNumber || null,
          } as ColumnMapping,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          usageCount: 1,
          isDefault: false,
        };
        await onSaveMapping(savedMapping);
      } else if (selectedSavedMappingId && onSaveMapping) {
        // Increment usage count of existing mapping
        const existing = savedMappings.find((m) => m.id === selectedSavedMappingId);
        if (existing) {
          await onSaveMapping({
            ...existing,
            usageCount: (existing.usageCount || 0) + 1,
          });
        }
      }

      onConfirm({
        firstName: finalMapping.firstName || null,
        lastName: finalMapping.lastName || null,
        fullName: finalMapping.fullName || null,
        ticketNumber: finalMapping.ticketNumber || null,
      } as ColumnMapping, savedMapping);
    }
  };

  const handleSelectSavedMapping = (mappingId: string) => {
    if (mappingId === 'manual') {
      // Reset to manual configuration
      setSelectedSavedMappingId('');
      setShouldSaveMapping(false);
      // Use initial mapping
      setMapping(initialMapping);
      setUseFullName(!!initialMapping.fullName || (!initialMapping.firstName && !initialMapping.lastName));
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

  const isValid = useFullName
    ? mapping.fullName && mapping.ticketNumber
    : mapping.firstName && mapping.lastName && mapping.ticketNumber;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Map CSV Columns
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
                  {safeHeaders.length > 0 ? (
                    safeHeaders.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="_no_headers" disabled>
                      No columns detected
                    </SelectItem>
                  )}
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
                    {safeHeaders.length > 0 ? (
                      safeHeaders.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="_no_headers" disabled>
                        No columns detected
                      </SelectItem>
                    )}
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
                    {safeHeaders.length > 0 ? (
                      safeHeaders.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="_no_headers" disabled>
                        No columns detected
                      </SelectItem>
                    )}
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
                {safeHeaders.length > 0 ? (
                  safeHeaders.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="_no_headers" disabled>
                    No columns detected
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Save Mapping Option */}
          {onSaveMapping && (
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
          )}
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