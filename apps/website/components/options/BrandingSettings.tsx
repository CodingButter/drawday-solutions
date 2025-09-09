/**
 * Branding Settings Component
 *
 * Purpose: Allows users to upload and manage company branding including
 * logos, banners, and company name display.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@raffle-spinner/ui';
import { Label } from '@raffle-spinner/ui';
import { Input } from '@raffle-spinner/ui';
import { Switch } from '@raffle-spinner/ui';
import { NativeSelect, NativeSelectOption } from '@raffle-spinner/ui';
import { Alert, AlertDescription } from '@raffle-spinner/ui';
import { useTheme } from '@/contexts';
import { InfoTooltip } from '@raffle-spinner/ui';
import { ImageUpload } from '@raffle-spinner/ui';
import { Building2, AlertCircle } from 'lucide-react';

export function BrandingSettings() {
  const { theme, updateBranding, isLoading } = useTheme();
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Debug logging
  useEffect(() => {
    console.log('BrandingSettings - showCompanyName value:', theme?.branding?.showCompanyName);
    console.log('BrandingSettings - showCompanyName type:', typeof theme?.branding?.showCompanyName);
    console.log('BrandingSettings - full branding:', theme?.branding);
  }, [theme?.branding?.showCompanyName]);
  
  if (isLoading || !theme?.branding) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading branding settings...</div>
      </div>
    );
  }

  const helpContent = {
    logo: {
      title: 'Company Logo',
      description: 'Upload your company logo to display in the side panel',
      details: {
        content:
          'Your logo will be displayed at the top of the side panel during raffles. For best results, use a transparent PNG file.',
        tips: [
          'Recommended size: 200x100 pixels',
          'Use PNG format for transparency',
          'Keep file size under 5MB',
        ],
      },
    },
    banner: {
      title: 'Default Banner',
      description: 'Upload a banner image to display across the top of the side panel',
      details: {
        content:
          'The banner will be displayed prominently at the top of the raffle interface. This can be overridden by competition-specific banners.',
        tips: [
          'Recommended size: 800x200 pixels',
          'Use high-quality images for best display',
          'Consider your brand colors and theme',
        ],
      },
    },
    companyName: {
      title: 'Company Name',
      description: 'Display your company name alongside the logo',
      details: {
        content:
          'Your company name will appear next to your logo if enabled. This helps with brand recognition during live events.',
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Branding Settings
        </CardTitle>
        <CardDescription>Customize your company branding and visual identity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {/* Logo Upload */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>Company Logo</Label>
            <InfoTooltip {...helpContent.logo} iconSize="sm" />
          </div>

          <div className="flex items-center gap-4">
            <ImageUpload
              value={theme.branding.logoImage}
              onChange={(value) => updateBranding({ logoImage: value })}
              onError={setUploadError}
              width="w-32"
              height="h-20"
              compact={true}
              compress={true}
              compressionOptions={{
                quality: 85,
                maxWidth: 400,
                maxHeight: 400,
              }}
            />

            <div className="flex-1">
              <NativeSelect
                value={theme.branding.logoPosition}
                onChange={(e) =>
                  updateBranding({ logoPosition: e.target.value as 'left' | 'center' | 'right' })
                }
              >
                <NativeSelectOption value="left">Position: Left</NativeSelectOption>
                <NativeSelectOption value="center">Position: Center</NativeSelectOption>
                <NativeSelectOption value="right">Position: Right</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>
        </div>

        {/* Banner Upload */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>Default Banner</Label>
            <InfoTooltip {...helpContent.banner} iconSize="sm" />
          </div>

          <ImageUpload
            value={theme.branding.bannerImage}
            onChange={(value) => updateBranding({ bannerImage: value })}
            onError={setUploadError}
            height="h-32"
            compress={true}
            compressionOptions={{
              quality: 80,
              maxWidth: 1200,
              maxHeight: 400,
            }}
          />
        </div>

        {/* Company Name */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>Company Name</Label>
            <InfoTooltip {...helpContent.companyName} iconSize="sm" />
          </div>

          <div className="space-y-3">
            <Input
              value={theme.branding.companyName || ''}
              onChange={(e) => updateBranding({ companyName: e.target.value })}
              placeholder="Enter your company name"
            />

            <div className="flex items-center space-x-2">
              <Switch
                id="show-company-name"
                checked={theme.branding.showCompanyName === true}
                onCheckedChange={(checked) => {
                  console.log('Switch toggled:', checked, 'type:', typeof checked);
                  updateBranding({ showCompanyName: Boolean(checked) });
                }}
              />
              <Label htmlFor="show-company-name" className="cursor-pointer">Display company name with logo</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
