/**
 * Saved Mappings Manager Component (Website Version)
 *
 * Purpose: Manages saved CSV column mappings, allowing users to view, edit,
 * delete, and set default mappings for future CSV imports.
 */

import { useState, useEffect } from 'react';
import { useSettings } from '@/contexts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@raffle-spinner/ui';
import { Button } from '@raffle-spinner/ui';
import { Badge } from '@raffle-spinner/ui';
import { Trash2, Edit, Star, StarOff } from 'lucide-react';
import { InfoTooltip } from '@raffle-spinner/ui';
import { helpContent } from '@/lib/help-content';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@raffle-spinner/ui';
import { Input } from '@raffle-spinner/ui';
import { Label } from '@raffle-spinner/ui';

export function SavedMappingsManager() {
  const { savedMappings, saveMappingTemplate, deleteMappingTemplate } = useSettings();
  const [defaultMappingId, setDefaultMappingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    // Load default mapping from localStorage
    const savedDefault = localStorage.getItem('defaultMappingId');
    setDefaultMappingId(savedDefault);
  }, []);

  const handleSetDefault = async (mapping: any) => {
    localStorage.setItem('defaultMappingId', mapping.id);
    setDefaultMappingId(mapping.id);
  };

  const handleRemoveDefault = async () => {
    localStorage.removeItem('defaultMappingId');
    setDefaultMappingId(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    deleteMappingTemplate(deleteTarget.id);
    setDeleteTarget(null);

    if (deleteTarget.id === defaultMappingId) {
      handleRemoveDefault();
    }
  };

  const handleEditSave = async () => {
    if (!editTarget || !editName.trim()) return;

    // For now, we can't edit existing mappings, so just close
    // TODO: Add ability to edit mapping names in settings context
    setEditTarget(null);
    setEditName('');
  };

  const formatMapping = (mapping: any) => {
    const parts = [];
    if (mapping.mapping.fullName) {
      parts.push(`Full Name: ${mapping.mapping.fullName}`);
    } else {
      if (mapping.mapping.firstName) parts.push(`First: ${mapping.mapping.firstName}`);
      if (mapping.mapping.lastName) parts.push(`Last: ${mapping.mapping.lastName}`);
    }
    if (mapping.mapping.ticketNumber) {
      parts.push(`Ticket: ${mapping.mapping.ticketNumber}`);
    }
    return parts.join(', ');
  };

  if (savedMappings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Saved Column Mappings
            <InfoTooltip {...helpContent.savedMappings} />
          </CardTitle>
          <CardDescription>
            No saved mappings yet. Mappings will appear here after you import CSVs.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Saved Column Mappings
            <InfoTooltip {...helpContent.savedMappings} />
          </CardTitle>
          <CardDescription>
            Manage your saved CSV column mappings. Set a default to auto-apply to new imports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {savedMappings.map((mapping) => (
              <div
                key={mapping.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{mapping.name}</span>
                    {mapping.id === defaultMappingId && <Badge variant="secondary">Default</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{formatMapping(mapping)}</p>
                </div>

                <div className="flex items-center gap-2">
                  {mapping.id === defaultMappingId ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveDefault}
                      title="Remove as default"
                    >
                      <StarOff className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSetDefault(mapping)}
                      title="Set as default"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditTarget(mapping);
                      setEditName(mapping.name);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(mapping)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Mapping</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Name Dialog */}
      <AlertDialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Mapping Name</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mapping-name">Name</Label>
              <Input
                id="mapping-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter mapping name"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEditName('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEditSave}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}