'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
  Badge,
  Checkbox,
} from '@raffle-spinner/ui';
import { Save, Loader2, History, Star, Trash2 } from 'lucide-react';

interface ColumnMapping {
  id: number;
  name: string;
  description?: string;
  mapping_config: Record<string, string>;
  file_type: string;
  delimiter: string;
  has_headers: boolean;
  is_default: boolean;
  usage_count: number;
  last_used_at?: string;
  created_at: string;
}

interface SavedMappingsProps {
  currentMapping: Record<string, string>;
  onLoadMapping: (mapping: Record<string, string>) => void;
  onSaveMapping?: (name: string, description?: string, isDefault?: boolean) => void;
}

export function SavedMappings({
  currentMapping,
  onLoadMapping,
  onSaveMapping,
}: SavedMappingsProps) {
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedMappingId, setSelectedMappingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mappingName, setMappingName] = useState('');
  const [mappingDescription, setMappingDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    fetchMappings();
  }, []);

  const fetchMappings = async () => {
    try {
      const token = localStorage.getItem('directus_auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/column-mappings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { mappings } = await response.json();
        setMappings(mappings || []);

        // Auto-select default mapping
        const defaultMapping = mappings?.find((m: ColumnMapping) => m.is_default);
        if (defaultMapping) {
          setSelectedMappingId(defaultMapping.id);
        }
      }
    } catch (error) {
      console.error('Error fetching mappings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMapping = (mappingId: number) => {
    const mapping = mappings.find((m) => m.id === mappingId);
    if (mapping) {
      onLoadMapping(mapping.mapping_config);
      setSelectedMappingId(mappingId);

      // Update usage count
      fetch('/api/column-mappings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('directus_auth_token')}`,
        },
        body: JSON.stringify({ mappingId }),
      });
    }
  };

  const handleSaveMapping = async () => {
    if (!mappingName.trim()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('directus_auth_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/column-mappings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: mappingName,
          description: mappingDescription,
          mapping_config: currentMapping,
          is_default: isDefault,
          file_type: 'csv',
          delimiter: ',',
          has_headers: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save mapping');
      }

      const { mapping } = await response.json();

      // Add to local state
      setMappings([mapping, ...mappings]);

      // Reset form
      setMappingName('');
      setMappingDescription('');
      setIsDefault(false);
      setDialogOpen(false);

      // Call parent callback if provided
      onSaveMapping?.(mappingName, mappingDescription, isDefault);
    } catch (error) {
      console.error('Error saving mapping:', error);
    } finally {
      setSaving(false);
    }
  };

  const hasCurrentMapping = Object.keys(currentMapping).length > 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Column Mappings</CardTitle>
          <CardDescription>Loading saved mappings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Column Mappings</CardTitle>
        <CardDescription>Save and reuse column mappings for consistent CSV imports</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mappings.length > 0 && (
          <div className="space-y-2">
            <Label>Load Saved Mapping</Label>
            <Select
              value={selectedMappingId?.toString() || ''}
              onValueChange={(value) => handleLoadMapping(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a saved mapping" />
              </SelectTrigger>
              <SelectContent>
                {mappings.map((mapping) => (
                  <SelectItem key={mapping.id} value={mapping.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span>{mapping.name}</span>
                        {mapping.is_default && (
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                        )}
                        {mapping.usage_count > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Used {mapping.usage_count}x
                          </Badge>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedMappingId && (
              <div className="text-xs text-muted-foreground">
                {(() => {
                  const mapping = mappings.find((m) => m.id === selectedMappingId);
                  if (mapping?.description) {
                    return mapping.description;
                  }
                  return null;
                })()}
              </div>
            )}
          </div>
        )}

        {hasCurrentMapping && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Current Mapping
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Column Mapping</DialogTitle>
                <DialogDescription>
                  Save your current column mapping for reuse with similar CSV files
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mapping-name">Name</Label>
                  <Input
                    id="mapping-name"
                    value={mappingName}
                    onChange={(e) => setMappingName(e.target.value)}
                    placeholder="e.g., Standard Customer Export"
                  />
                </div>
                <div>
                  <Label htmlFor="mapping-description">Description (optional)</Label>
                  <Textarea
                    id="mapping-description"
                    value={mappingDescription}
                    onChange={(e) => setMappingDescription(e.target.value)}
                    placeholder="Describe when to use this mapping..."
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-default"
                    checked={isDefault}
                    onCheckedChange={(checked) => setIsDefault(!!checked)}
                  />
                  <Label htmlFor="is-default">Set as default mapping</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveMapping} disabled={!mappingName.trim() || saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Mapping'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {mappings.length === 0 && !hasCurrentMapping && (
          <div className="text-center py-4 text-muted-foreground">
            No saved mappings yet. Import a CSV and save your column mapping for reuse.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
