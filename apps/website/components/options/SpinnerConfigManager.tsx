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
import { Save, Loader2, Settings, Star, Trash2 } from 'lucide-react';
import { useSettings } from '@/contexts';

interface SpinnerConfig {
  id: number;
  name: string;
  description?: string;
  spinner_type_id: number;
  theme_config: Record<string, any>;
  physics_config: Record<string, any>;
  sound_config: Record<string, any>;
  animation_config: Record<string, any>;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface SpinnerConfigManagerProps {
  currentSpinnerType?: string;
  onLoadConfig?: (config: SpinnerConfig) => void;
}

export function SpinnerConfigManager({
  currentSpinnerType,
  onLoadConfig,
}: SpinnerConfigManagerProps) {
  const { settings } = useSettings();
  const [configs, setConfigs] = useState<SpinnerConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<SpinnerConfig | null>(null);
  const [configName, setConfigName] = useState('');
  const [configDescription, setConfigDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const token = localStorage.getItem('directus_auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/spinner-configs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { configs } = await response.json();
        setConfigs(configs || []);

        // Auto-select default config
        const defaultConfig = configs?.find((c: SpinnerConfig) => c.is_default);
        if (defaultConfig) {
          setSelectedConfigId(defaultConfig.id);
          onLoadConfig?.(defaultConfig);
        }
      }
    } catch (error) {
      console.error('Error fetching configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadConfig = (configId: number) => {
    const config = configs.find((c) => c.id === configId);
    if (config) {
      setSelectedConfigId(configId);
      onLoadConfig?.(config);
    }
  };

  const handleSaveConfig = async () => {
    if (!configName.trim()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('directus_auth_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Get current spinner type from settings or props
      const spinnerTypeId = 1; // Default to slot_machine, should be dynamic

      const response = await fetch('/api/spinner-configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: configName,
          description: configDescription,
          spinner_type_id: spinnerTypeId,
          theme_config: {}, // TODO: Get theme config from ThemeContext
          physics_config: {
            spinDuration: settings.spinDuration,
            decelerationSpeed: settings.decelerationSpeed,
          },
          sound_config: {}, // TODO: Add sound settings when available
          animation_config: {},
          is_default: isDefault,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      const { config } = await response.json();

      // Add to local state
      setConfigs([config, ...configs]);

      // Reset form
      setConfigName('');
      setConfigDescription('');
      setIsDefault(false);
      setDialogOpen(false);

      // Refresh configs
      fetchConfigs();
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfig = async () => {
    if (!configToDelete) return;

    try {
      const token = localStorage.getItem('directus_auth_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/spinner-configs?id=${configToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete configuration');
      }

      // Remove from local state
      setConfigs(configs.filter((c) => c.id !== configToDelete.id));

      // Clear selection if deleted config was selected
      if (selectedConfigId === configToDelete.id) {
        setSelectedConfigId(null);
      }

      setConfigToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting config:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spinner Configurations</CardTitle>
          <CardDescription>Loading saved configurations...</CardDescription>
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Spinner Configurations</CardTitle>
          <CardDescription>
            Save and load complete spinner configurations including theme, physics, and sounds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {configs.length > 0 && (
            <div className="space-y-2">
              <Label>Load Saved Configuration</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedConfigId?.toString() || ''}
                  onValueChange={(value) => handleLoadConfig(parseInt(value))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a saved configuration" />
                  </SelectTrigger>
                  <SelectContent>
                    {configs.map((config) => (
                      <SelectItem key={config.id} value={config.id.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <span>{config.name}</span>
                            {config.is_default && (
                              <Star className="h-3 w-3 fill-current text-yellow-500" />
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedConfigId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const config = configs.find((c) => c.id === selectedConfigId);
                      if (config) {
                        setConfigToDelete(config);
                        setDeleteDialogOpen(true);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {selectedConfigId && (
                <div className="text-xs text-muted-foreground">
                  {(() => {
                    const config = configs.find((c) => c.id === selectedConfigId);
                    if (config?.description) {
                      return config.description;
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Current Configuration
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Spinner Configuration</DialogTitle>
                <DialogDescription>
                  Save your current spinner settings for reuse later
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="config-name">Name</Label>
                  <Input
                    id="config-name"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    placeholder="e.g., Holiday Theme"
                  />
                </div>
                <div>
                  <Label htmlFor="config-description">Description (optional)</Label>
                  <Textarea
                    id="config-description"
                    value={configDescription}
                    onChange={(e) => setConfigDescription(e.target.value)}
                    placeholder="Describe when to use this configuration..."
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-default-config"
                    checked={isDefault}
                    onCheckedChange={(checked) => setIsDefault(!!checked)}
                  />
                  <Label htmlFor="is-default-config">Set as default configuration</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveConfig} disabled={!configName.trim() || saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Configuration'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {configs.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No saved configurations yet. Configure your spinner and save it for reuse.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Configuration</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{configToDelete?.name}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfig}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
