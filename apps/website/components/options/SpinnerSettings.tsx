/**
 * Spinner Settings Component
 *
 * Purpose: User interface for configuring spinner physics parameters including
 * minimum spin duration and deceleration rate to customize animation behavior.
 *
 * SRS Reference:
 * - FR-1.7: Spinner Physics Configuration
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@raffle-spinner/ui';
import { Label } from '@raffle-spinner/ui';
import { Slider } from '@raffle-spinner/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@raffle-spinner/ui';
// Storage types are now in contexts
import { InfoTooltip } from '@raffle-spinner/ui';
import { helpContent } from '@/lib/help-content';

interface SpinnerSettings {
  minSpinDuration: number;
  decelerationRate: 'slow' | 'medium' | 'fast';
  soundEnabled?: boolean;
}

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
            <Label htmlFor="min-duration">
              Minimum Spin Duration: {settings.minSpinDuration} seconds
            </Label>
            <InfoTooltip {...helpContent.spinnerSettings.minSpinDuration} />
          </div>
          <Slider
            id="min-duration"
            min={1}
            max={10}
            step={0.5}
            value={[settings.minSpinDuration]}
            onValueChange={([value]) => onUpdate({ minSpinDuration: value })}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            The minimum time the spinner will rotate before stopping
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="deceleration">Deceleration Rate</Label>
            <InfoTooltip {...helpContent.spinnerSettings.decelerationRate} />
          </div>
          <Select
            value={settings.decelerationRate}
            onValueChange={(value: 'slow' | 'medium' | 'fast') =>
              onUpdate({ decelerationRate: value })
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
          <p className="text-xs text-muted-foreground">How quickly the wheel slows down</p>
        </div>
      </CardContent>
    </Card>
  );
}
