/**
 * Spinner Settings Component
 *
 * Purpose: User interface for configuring spinner physics parameters
 * with spin duration and deceleration speed controls.
 *
 * SRS Reference:
 * - FR-1.7: Spinner Physics Configuration
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@raffle-spinner/ui';
import { Label } from '@raffle-spinner/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@raffle-spinner/ui';
import type { SpinnerSettings } from '@raffle-spinner/types';
import { InfoTooltip } from '@raffle-spinner/ui';
import { helpContent } from '@/lib/help-content';

interface SpinnerSettingsProps {
  settings: SpinnerSettings;
  onUpdate: (settings: Partial<SpinnerSettings>) => void;
}

export function SpinnerSettings({ settings, onUpdate }: SpinnerSettingsProps) {
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
            <Label htmlFor="duration">Spin Duration</Label>
            <InfoTooltip {...helpContent.spinnerSettings.spinDuration} />
          </div>
          <Select
            value={settings.spinDuration}
            onValueChange={(value: 'short' | 'medium' | 'long') =>
              onUpdate({ spinDuration: value })
            }
          >
            <SelectTrigger id="duration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short (2 seconds)</SelectItem>
              <SelectItem value="medium">Medium (3 seconds)</SelectItem>
              <SelectItem value="long">Long (5 seconds)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            How long the spinner rotates at maximum speed
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="deceleration">Deceleration Speed</Label>
            <InfoTooltip {...helpContent.spinnerSettings.decelerationSpeed} />
          </div>
          <Select
            value={settings.decelerationSpeed}
            onValueChange={(value: 'slow' | 'medium' | 'fast') =>
              onUpdate({ decelerationSpeed: value })
            }
          >
            <SelectTrigger id="deceleration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slow">Slow</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="fast">Fast</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            How quickly the wheel slows down after maximum speed phase
          </p>
        </div>
      </CardContent>
    </Card>
  );
}