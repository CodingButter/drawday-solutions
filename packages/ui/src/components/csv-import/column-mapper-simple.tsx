/**
 * Simple Column Mapper Component
 *
 * Purpose: Modal interface for mapping CSV column headers to required data fields
 * using standard HTML select elements for better compatibility and clarity.
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
import { Input } from '../input';
import { Checkbox } from '../checkbox';
import { ChevronDown } from 'lucide-react';
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
  detectedMapping: _detectedMapping, // Unused but kept for API compatibility
  onConfirm,
  savedMappings = [],
  suggestedMappingId: _suggestedMappingId, // Unused but kept for API compatibility
  onSaveMapping,
}: ColumnMapperProps) {
  // Ensure headers is always a valid array
  const safeHeaders = React.useMemo(() => {
    if (!headers || !Array.isArray(headers)) {
      return [];
    }
    return headers.filter(h => h && typeof h === 'string' && h.trim());
  }, [headers]);

  // Initialize state with auto-detection
  const [useFullName, setUseFullName] = React.useState<boolean>(false);
  const [fullNameColumn, setFullNameColumn] = React.useState<string>('');
  const [firstNameColumn, setFirstNameColumn] = React.useState<string>('');
  const [lastNameColumn, setLastNameColumn] = React.useState<string>('');
  const [ticketNumberColumn, setTicketNumberColumn] = React.useState<string>('');
  const [shouldSaveMapping, setShouldSaveMapping] = React.useState(false);
  const [mappingName, setMappingName] = React.useState('');
  const [selectedSavedMappingId, setSelectedSavedMappingId] = React.useState<string>('');

  // Inject styles and cleanup body styles
  React.useEffect(() => {
    if (open) {
      const styleId = 'column-mapper-fix-styles';
      let styleEl = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.innerHTML = `
          /* Dialog overlay */
          [data-radix-dialog-overlay],
          [role="dialog"] + [data-radix-presence-slot] {
            position: fixed !important;
            inset: 0 !important;
            z-index: 9998 !important;
            background: rgba(0, 0, 0, 0.8) !important;
            backdrop-filter: blur(4px) !important;
            animation: fadeIn 0.15s ease-out !important;
          }
          
          /* Main dialog */
          [role="dialog"] {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 9999 !important;
            background: #1e293b !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 1rem !important;
            padding: 1.75rem !important;
            max-width: 32rem !important;
            width: calc(100% - 2rem) !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
            animation: dialogSlideIn 0.2s ease-out !important;
          }
          
          /* Dialog title */
          [role="dialog"] h2 {
            color: #f8fafc !important;
            font-size: 1.25rem !important;
            font-weight: 600 !important;
            margin-bottom: 0.5rem !important;
          }
          
          /* Dialog description */
          [role="dialog"] p {
            color: rgba(248, 250, 252, 0.7) !important;
            margin-bottom: 1.5rem !important;
          }
          
          /* Labels */
          [role="dialog"] label {
            color: #cbd5e1 !important;
            font-weight: 500 !important;
            font-size: 0.875rem !important;
            display: block !important;
            margin-bottom: 0.5rem !important;
          }
          
          /* Select dropdowns */
          [role="dialog"] select {
            width: 100% !important;
            padding: 0.5rem 2.5rem 0.5rem 0.75rem !important;
            background: #0f172a !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 0.5rem !important;
            color: #f8fafc !important;
            transition: all 0.2s !important;
            cursor: pointer !important;
          }
          
          [role="dialog"] select:hover {
            background: #1e293b !important;
            border-color: rgba(255, 255, 255, 0.2) !important;
          }
          
          [role="dialog"] select:focus {
            outline: none !important;
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }
          
          /* Input fields */
          [role="dialog"] input[type="text"] {
            width: 100% !important;
            padding: 0.5rem 0.75rem !important;
            background: #0f172a !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 0.5rem !important;
            color: #f8fafc !important;
            transition: all 0.2s !important;
          }
          
          [role="dialog"] input[type="text"]:focus {
            outline: none !important;
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }
          
          /* Radio buttons */
          [role="dialog"] input[type="radio"] {
            margin-right: 0.5rem !important;
            cursor: pointer !important;
          }
          
          /* Checkboxes */
          [role="dialog"] input[type="checkbox"] {
            margin-right: 0.5rem !important;
            cursor: pointer !important;
          }
          
          /* Footer buttons */
          [role="dialog"] > div:last-child {
            display: flex !important;
            gap: 0.75rem !important;
            justify-content: flex-end !important;
            margin-top: 1.5rem !important;
            padding-top: 1.5rem !important;
            border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
          
          [role="dialog"] button {
            padding: 0.5rem 1rem !important;
            border-radius: 0.5rem !important;
            font-weight: 500 !important;
            transition: all 0.2s !important;
            cursor: pointer !important;
          }
          
          /* Cancel button */
          [role="dialog"] button[data-button-variant="outline"] {
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            color: #cbd5e1 !important;
          }
          
          [role="dialog"] button[data-button-variant="outline"]:hover {
            background: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.3) !important;
            color: #f8fafc !important;
          }
          
          /* Confirm button */
          [role="dialog"] button:not([data-button-variant]) {
            background: #3b82f6 !important;
            border: 1px solid #3b82f6 !important;
            color: white !important;
          }
          
          [role="dialog"] button:not([data-button-variant]):hover:not(:disabled) {
            background: #2563eb !important;
            border-color: #2563eb !important;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
          }
          
          [role="dialog"] button:disabled {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes dialogSlideIn {
            from {
              opacity: 0;
              transform: translate(-50%, -48%) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `;
        document.head.appendChild(styleEl);
      }
      
      return () => {
        // Clean up styles
        if (styleEl && styleEl.parentNode) {
          styleEl.parentNode.removeChild(styleEl);
        }
        // Remove any lingering body styles that prevent scrolling
        document.body.style.pointerEvents = '';
        document.body.style.overflow = '';
      };
    }
    
    return () => {
      // Remove any lingering body styles that prevent scrolling
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
    };
  }, [open]);

  // Auto-detect columns when modal opens
  React.useEffect(() => {
    if (open && safeHeaders.length > 0) {
      // Reset state
      setFullNameColumn('');
      setFirstNameColumn('');
      setLastNameColumn('');
      setTicketNumberColumn('');
      
      // Auto-detect from headers
      safeHeaders.forEach((header) => {
        const lower = header.toLowerCase();
        
        // Detect full name
        if (!fullNameColumn && (
          lower === 'name' || 
          lower === 'full name' || 
          lower === 'fullname' ||
          lower === 'participant'
        )) {
          setFullNameColumn(header);
          setUseFullName(true);
        }
        
        // Detect first name
        if (!firstNameColumn && lower.includes('first') && lower.includes('name')) {
          setFirstNameColumn(header);
        }
        
        // Detect last name
        if (!lastNameColumn && lower.includes('last') && lower.includes('name')) {
          setLastNameColumn(header);
        }
        
        // Detect ticket number
        if (!ticketNumberColumn && (
          lower.includes('ticket') || 
          lower.includes('number') || 
          lower === 'no' || 
          lower === '#' ||
          lower === 'id' ||
          lower === 'entry' ||
          lower === 'ticketnumber'
        )) {
          setTicketNumberColumn(header);
        }
      });
      
      // If we have first/last name but no full name, use separate mode
      if (firstNameColumn && lastNameColumn && !fullNameColumn) {
        setUseFullName(false);
      }
    }
  }, [open, safeHeaders]);

  const handleConfirm = async () => {
    const mapping: ColumnMapping = useFullName
      ? {
          fullName: fullNameColumn || null,
          firstName: null,
          lastName: null,
          ticketNumber: ticketNumberColumn || null,
        }
      : {
          fullName: null,
          firstName: firstNameColumn || null,
          lastName: lastNameColumn || null,
          ticketNumber: ticketNumberColumn || null,
        };

    // Validate required fields
    const isValid = useFullName
      ? mapping.fullName && mapping.ticketNumber
      : mapping.firstName && mapping.lastName && mapping.ticketNumber;

    if (isValid) {
      let savedMapping: SavedMapping | undefined;

      if (shouldSaveMapping && mappingName.trim() && onSaveMapping) {
        savedMapping = {
          id: `mapping-${Date.now()}`,
          name: mappingName.trim(),
          mapping,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          usageCount: 1,
          isDefault: false,
        };
        await onSaveMapping(savedMapping);
      }

      console.log('ColumnMapper - calling onConfirm with mapping:', mapping);
      onConfirm(mapping, savedMapping);
      // The parent should close the modal by setting open to false
    }
  };

  const handleSelectSavedMapping = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mappingId = e.target.value;
    
    if (mappingId === 'manual') {
      setSelectedSavedMappingId('');
      setShouldSaveMapping(false);
      // Reset to auto-detected values
      return;
    }
    
    const saved = savedMappings.find((m) => m.id === mappingId);
    if (saved) {
      setSelectedSavedMappingId(mappingId);
      setShouldSaveMapping(false);
      
      if (saved.mapping.fullName) {
        setUseFullName(true);
        setFullNameColumn(saved.mapping.fullName);
        setFirstNameColumn('');
        setLastNameColumn('');
      } else {
        setUseFullName(false);
        setFullNameColumn('');
        setFirstNameColumn(saved.mapping.firstName || '');
        setLastNameColumn(saved.mapping.lastName || '');
      }
      setTicketNumberColumn(saved.mapping.ticketNumber || '');
    }
  };

  const isValid = useFullName
    ? fullNameColumn && ticketNumberColumn
    : firstNameColumn && lastNameColumn && ticketNumberColumn;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      console.log('Dialog onOpenChange called with:', isOpen);
      if (!isOpen) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-lg" onInteractOutside={(e) => {
        // Prevent closing on outside click to avoid accidental closes
        e.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle>Map CSV Columns</DialogTitle>
          <DialogDescription>
            Select which columns in your CSV correspond to the required fields.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Saved Mappings Selector */}
          {savedMappings.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="savedMapping">Use Saved Mapping</Label>
              <select
                id="savedMapping"
                value={selectedSavedMappingId || 'manual'}
                onChange={handleSelectSavedMapping}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="manual">Configure manually</option>
                {savedMappings.map((saved) => (
                  <option key={saved.id} value={saved.id}>
                    {saved.name} {saved.isDefault && '(Default)'}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Toggle between full name and separate name columns */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="separateNames"
                name="nameFormat"
                checked={!useFullName}
                onChange={() => setUseFullName(false)}
                className="h-4 w-4"
              />
              <Label htmlFor="separateNames" className="font-normal cursor-pointer">
                Separate first and last name columns
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="fullName"
                name="nameFormat"
                checked={useFullName}
                onChange={() => setUseFullName(true)}
                className="h-4 w-4"
              />
              <Label htmlFor="fullName" className="font-normal cursor-pointer">
                Single column with full names
              </Label>
            </div>
          </div>

          {/* Show appropriate fields based on selection */}
          {useFullName ? (
            <div className="space-y-2">
              <Label htmlFor="fullNameColumn">Full Name Column</Label>
              <div className="relative">
                <select
                  id="fullNameColumn"
                  value={fullNameColumn}
                  onChange={(e) => setFullNameColumn(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:bg-accent/5"
                >
                  <option value="">Select a column</option>
                  {safeHeaders.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
              </div>
              <p className="text-xs text-muted-foreground">
                Names will be automatically split. Supports "First Last", "Last, First", and multi-word names.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name Column</Label>
                <div className="relative">
                  <select
                    id="firstName"
                    value={firstNameColumn}
                    onChange={(e) => setFirstNameColumn(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:bg-accent/5"
                  >
                    <option value="">Select a column</option>
                    {safeHeaders.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name Column</Label>
                <div className="relative">
                  <select
                    id="lastName"
                    value={lastNameColumn}
                    onChange={(e) => setLastNameColumn(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:bg-accent/5"
                  >
                    <option value="">Select a column</option>
                    {safeHeaders.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="ticketNumber">Ticket Number Column</Label>
            <div className="relative">
              <select
                id="ticketNumber"
                value={ticketNumberColumn}
                onChange={(e) => setTicketNumberColumn(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:bg-accent/5"
              >
                <option value="">Select a column</option>
                {safeHeaders.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
            </div>
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
          <Button variant="outline" onClick={onClose} data-button-variant="outline">
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