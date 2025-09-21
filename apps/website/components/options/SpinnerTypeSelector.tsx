'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Badge,
} from '@raffle-spinner/ui';
import { Loader2, Save, Settings } from 'lucide-react';

interface SpinnerType {
  id: number;
  name: string;
  code: string;
  description: string;
  default_settings: Record<string, any>;
  min_participants: number;
  max_participants: number | null;
  is_premium: boolean;
}

interface SpinnerTypeSelectorProps {
  selectedType?: string;
  onTypeChange: (type: string, settings: Record<string, any>) => void;
  participantCount?: number;
}

export function SpinnerTypeSelector({
  selectedType = 'slot_machine',
  onTypeChange,
  participantCount = 0,
}: SpinnerTypeSelectorProps) {
  const [spinnerTypes, setSpinnerTypes] = useState<SpinnerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentType, setCurrentType] = useState(selectedType);

  useEffect(() => {
    fetchSpinnerTypes();
  }, []);

  const fetchSpinnerTypes = async () => {
    try {
      const response = await fetch('/api/spinner-types');
      if (!response.ok) throw new Error('Failed to fetch spinner types');

      const { spinnerTypes } = await response.json();
      setSpinnerTypes(spinnerTypes || []);
    } catch (error) {
      console.error('Error fetching spinner types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (typeCode: string) => {
    const selectedSpinner = spinnerTypes.find((t) => t.code === typeCode);
    if (selectedSpinner) {
      setCurrentType(typeCode);
      onTypeChange(typeCode, selectedSpinner.default_settings);
    }
  };

  const isTypeAvailable = (type: SpinnerType) => {
    if (participantCount === 0) return true;
    if (participantCount < type.min_participants) return false;
    if (type.max_participants && participantCount > type.max_participants) return false;
    return true;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spinner Type</CardTitle>
          <CardDescription>Loading available spinner types...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-10">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedSpinner = spinnerTypes.find((t) => t.code === currentType);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spinner Type</CardTitle>
        <CardDescription>Choose the animation style for your raffle spinner</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={currentType} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a spinner type" />
          </SelectTrigger>
          <SelectContent>
            {spinnerTypes.map((type) => {
              const available = isTypeAvailable(type);
              return (
                <SelectItem key={type.id} value={type.code} disabled={!available}>
                  <div className="flex items-center justify-between w-full">
                    <span>{type.name}</span>
                    {type.is_premium && (
                      <Badge variant="secondary" className="ml-2">
                        Premium
                      </Badge>
                    )}
                    {!available && participantCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {participantCount < type.min_participants
                          ? `Min ${type.min_participants} participants`
                          : `Max ${type.max_participants} participants`}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {selectedSpinner && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{selectedSpinner.description}</p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Participants:</span>
              <span>
                {selectedSpinner.min_participants}
                {selectedSpinner.max_participants ? ` - ${selectedSpinner.max_participants}` : '+'}
              </span>
            </div>

            {selectedSpinner.is_premium && (
              <Badge variant="secondary" className="mt-2">
                Premium Feature
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
