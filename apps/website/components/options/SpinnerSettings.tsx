/**
 * Spinner Settings Component
 *
 * Purpose: User interface for configuring spinner physics parameters including
 * spin duration presets and deceleration speed to customize animation behavior.
 *
 * SRS Reference:
 * - FR-1.7: Spinner Physics Configuration
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@raffle-spinner/ui';
import { Label } from '@raffle-spinner/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@raffle-spinner/ui';
import { InfoTooltip } from '@raffle-spinner/ui';
import { helpContent } from '@/lib/help-content';
import type { SpinnerSettings } from '@raffle-spinner/types';

interface SpinnerSettingsProps {
  settings: SpinnerSettings;
  onUpdate: (settings: Partial<SpinnerSettings>) => void;
}

export function SpinnerSettings({ settings, onUpdate }: SpinnerSettingsProps) {
  if (!settings) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading spinner settings...</div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Spinner Settings</CardTitle>
        <CardDescription>
          Customize the physics and behavior of the spinner animation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="spin-duration">Spin Duration</Label>
            <InfoTooltip {...helpContent.spinnerSettings.spinDuration} />
          </div>
          <Select
            value={settings.spinDuration}
            onValueChange={(value) => onUpdate({ spinDuration: value as 'short' | 'medium' | 'long' })}
          >
            <SelectTrigger id="spin-duration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short (2 seconds)</SelectItem>
              <SelectItem value="medium">Medium (3 seconds)</SelectItem>
              <SelectItem value="long">Long (5 seconds)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            How long the spinner rotates at maximum speed before decelerating
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="deceleration-speed">Deceleration Speed</Label>
            <InfoTooltip {...helpContent.spinnerSettings.decelerationSpeed} />
          </div>
          <Select
            value={settings.decelerationSpeed}
            onValueChange={(value) => onUpdate({ decelerationSpeed: value as 'slow' | 'medium' | 'fast' })}
          >
            <SelectTrigger id="deceleration-speed">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slow">Slow</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="fast">Fast</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            How quickly the wheel slows down after the spin duration
          </p>
        </div>
      </CardContent>
    </Card>
  );
}