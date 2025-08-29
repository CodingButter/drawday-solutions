'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  getUserSettings, 
  updateSpinnerSettings, 
  updateSpinnerStyle,
  updateBranding,
  type UserSettings,
  defaultSettings
} from '@/lib/settings-service';
import { 
  getUserCompetitions, 
  updateCompetition,
  deleteCompetition as deleteCompetitionFromDb,
  type Competition 
} from '@/lib/firebase-service';
import { CSVParser, IntelligentColumnMapper } from '@raffle-spinner/csv-parser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@raffle-spinner/ui';
import { Button } from '@raffle-spinner/ui';
import { Input } from '@raffle-spinner/ui';
import { Label } from '@raffle-spinner/ui';
import { Switch } from '@raffle-spinner/ui';
import { Slider } from '@raffle-spinner/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@raffle-spinner/ui';
import { Alert, AlertDescription } from '@raffle-spinner/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@raffle-spinner/ui';
import { SlotMachineWheel } from '@raffle-spinner/spinners';
import { BannerImage } from '@/components/BannerImage';
import { 
  ChevronDown, 
  ChevronRight, 
  Upload, 
  Trash2, 
  Settings, 
  Palette, 
  Building2,
  Trophy,
  Save,
  Image,
  X,
  Eye
} from 'lucide-react';

function ConfigurationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('competitions');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Set initial tab from URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['competitions', 'spinner', 'appearance', 'branding'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Load user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
        
        // Load settings and competitions
        try {
          const [userSettings, userCompetitions] = await Promise.all([
            getUserSettings(firebaseUser.uid),
            getUserCompetitions(firebaseUser.uid)
          ]);
          
          setSettings(userSettings);
          setCompetitions(userCompetitions);
        } catch (err) {
          console.error('Error loading data:', err);
        }
        
        setLoading(false);
      } else {
        router.push('/login?from=/configuration');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSpinnerSettingChange = async (key: string, value: any) => {
    if (!settings || !user) return;
    
    const newSettings = {
      ...settings,
      spinner: {
        ...settings.spinner,
        [key]: value
      }
    };
    
    setSettings(newSettings);
    
    // Save to Firestore
    setSaving(true);
    try {
      await updateSpinnerSettings(user.uid, { [key]: value });
    } catch (err) {
      console.error('Error saving settings:', err);
    }
    setSaving(false);
  };

  const handleStyleChange = async (key: string, value: any) => {
    if (!settings || !user) return;
    
    const newSettings = {
      ...settings,
      theme: {
        ...settings.theme,
        spinnerStyle: {
          ...settings.theme.spinnerStyle,
          [key]: value
        }
      }
    };
    
    setSettings(newSettings);
    
    // Save to Firestore
    setSaving(true);
    try {
      await updateSpinnerStyle(user.uid, { [key]: value });
    } catch (err) {
      console.error('Error saving style:', err);
    }
    setSaving(false);
  };

  const handleBrandingChange = async (key: string, value: any) => {
    if (!settings || !user) return;
    
    const newSettings = {
      ...settings,
      theme: {
        ...settings.theme,
        branding: {
          ...settings.theme.branding,
          [key]: value
        }
      }
    };
    
    setSettings(newSettings);
    
    // Save to Firestore
    setSaving(true);
    try {
      await updateBranding(user.uid, { [key]: value });
    } catch (err) {
      console.error('Error saving branding:', err);
    }
    setSaving(false);
  };

  const handleImageUpload = async (type: 'logo' | 'banner', file: File) => {
    try {
      // Compress image using API route
      const { compressImage } = await import('@/lib/image-utils');
      const compressed = await compressImage(file, {
        quality: 80,
        maxWidth: type === 'logo' ? 400 : 1200,
        maxHeight: type === 'logo' ? 400 : 600
      });
      
      if (type === 'logo') {
        await handleBrandingChange('logoImage', compressed);
      } else {
        await handleBrandingChange('bannerImage', compressed);
      }
    } catch (err) {
      console.error('Error compressing image:', err);
      alert('Failed to process image. The image may be too large.');
    }
  };

  const handleCompetitionBannerUpload = async (competitionId: string, file: File) => {
    console.log('Starting banner upload for competition:', competitionId, 'File:', file);
    setUploadingBanner(competitionId);
    
    try {
      // Compress image using API route
      const { compressImage } = await import('@/lib/image-utils');
      console.log('Compressing image...');
      const compressed = await compressImage(file, {
        quality: 70,
        maxWidth: 1200,
        maxHeight: 400 // Good for banners
      });
      console.log('Image compressed successfully');
      
      // Store image in IndexedDB
      const { imageStore } = await import('@/lib/image-utils');
      const imageId = `banner-${competitionId}-${Date.now()}`;
      console.log('Saving to IndexedDB with ID:', imageId);
      await imageStore.saveImage(imageId, compressed);
      console.log('Saved to IndexedDB');
      
      // Update competition with image reference
      console.log('Updating competition in Firebase...');
      await updateCompetition(competitionId, { bannerImageId: imageId });
      console.log('Competition updated');
      
      // Update local state
      setCompetitions(prev => prev.map(c => 
        c.id === competitionId ? { ...c, bannerImageId: imageId } : c
      ));
      console.log('Local state updated');
    } catch (err) {
      console.error('Error uploading banner - Full error:', err);
      if (err instanceof Error) {
        alert(`Failed to upload banner: ${err.message}`);
      } else {
        alert('Failed to upload banner. The image may be too large.');
      }
    }
    
    setUploadingBanner(null);
  };

  const handleDeleteCompetition = async (competitionId: string) => {
    if (!window.confirm('Are you sure you want to delete this competition?')) {
      return;
    }

    try {
      await deleteCompetitionFromDb(competitionId);
      setCompetitions(prev => prev.filter(c => c.id !== competitionId));
    } catch (err) {
      console.error('Error deleting competition:', err);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Raffle Spinner Configuration</h1>
            <p className="text-gray-400 mt-2">
              Manage competitions and customize spinner settings
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="text-gray-300 border-gray-600 hover:bg-gray-800"
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={() => router.push('/live-spinner')}
              className="bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/90 hover:to-neon-pink/90"
            >
              Open Live Spinner
            </Button>
          </div>
        </div>

        {saving && (
          <Alert className="bg-green-900/20 border-green-900">
            <Save className="h-4 w-4" />
            <AlertDescription>Settings saved automatically</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-night-light border border-gray-800">
            <TabsTrigger value="competitions" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Competitions
            </TabsTrigger>
            <TabsTrigger value="spinner" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Spinner Settings
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Branding
            </TabsTrigger>
          </TabsList>

          {/* Competitions Tab */}
          <TabsContent value="competitions" className="space-y-4">
            <Card className="bg-night-light border-gray-800">
              <CardHeader>
                <CardTitle>Competition Management</CardTitle>
                <CardDescription>Manage your raffle competitions and upload banners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitions.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      No competitions yet. Upload a CSV from the dashboard to get started.
                    </p>
                  ) : (
                    competitions.map((competition) => (
                      <div key={competition.id} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{competition.name}</h3>
                            <p className="text-gray-400 text-sm">
                              {competition.participantCount} participants • 
                              {competition.winnersCount || 0} winners selected
                            </p>
                            
                            {/* Competition Banner */}
                            <div className="mt-4">
                              <Label className="text-sm text-gray-400">Competition Banner</Label>
                              {competition.bannerImageId ? (
                                <div className="mt-2 relative">
                                  <BannerImage imageId={competition.bannerImageId} />
                                  <button
                                    onClick={async () => {
                                      // Delete from IndexedDB
                                      if (competition.bannerImageId) {
                                        const { imageStore } = await import('@/lib/image-utils');
                                        await imageStore.deleteImage(competition.bannerImageId);
                                      }
                                      // Update competition
                                      await updateCompetition(competition.id!, { bannerImageId: undefined });
                                      setCompetitions(prev => prev.map(c => 
                                        c.id === competition.id ? { ...c, bannerImageId: undefined } : c
                                      ));
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-red-600 rounded hover:bg-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <label className="mt-2 flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 cursor-pointer inline-flex">
                                  <Image className="h-4 w-4" />
                                  {uploadingBanner === competition.id ? 'Uploading...' : 'Upload Banner'}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      console.log('File input changed:', e.target.files);
                                      const file = e.target.files?.[0];
                                      if (file && competition.id) {
                                        console.log('Calling handleCompetitionBannerUpload with:', competition.id, file);
                                        handleCompetitionBannerUpload(competition.id, file);
                                      } else {
                                        console.log('No file or competition ID:', { file, competitionId: competition.id });
                                      }
                                    }}
                                    disabled={uploadingBanner === competition.id}
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => competition.id && handleDeleteCompetition(competition.id)}
                            className="ml-4 p-2 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spinner Settings Tab */}
          <TabsContent value="spinner" className="space-y-4">
            <Card className="bg-night-light border-gray-800">
              <CardHeader>
                <CardTitle>Spinner Physics</CardTitle>
                <CardDescription>Configure spin duration and physics settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Minimum Spin Duration: {settings.spinner.minSpinDuration}s</Label>
                  <Slider
                    value={[settings.spinner.minSpinDuration]}
                    onValueChange={(value) => handleSpinnerSettingChange('minSpinDuration', value[0])}
                    min={1}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Deceleration Rate</Label>
                  <Select
                    value={settings.spinner.decelerationRate}
                    onValueChange={(value) => handleSpinnerSettingChange('decelerationRate', value)}
                  >
                    <SelectTrigger className="bg-night border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-night-light border-gray-700">
                      <SelectItem value="slow">Slow (Longer spin)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="fast">Fast (Quick stop)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sound"
                    checked={settings.spinner.soundEnabled}
                    onCheckedChange={(checked) => handleSpinnerSettingChange('soundEnabled', checked)}
                  />
                  <Label htmlFor="sound">Enable sound effects</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4">
            {/* Live Preview */}
            <Card className="bg-night-light border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>See your changes in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-night rounded-lg p-4">
                  <SlotMachineWheel
                    participants={[
                      { firstName: 'John', lastName: 'Doe', ticketNumber: '12345' },
                      { firstName: 'Jane', lastName: 'Smith', ticketNumber: '67890' },
                      { firstName: 'Bob', lastName: 'Johnson', ticketNumber: '11111' },
                      { firstName: 'Alice', lastName: 'Williams', ticketNumber: '22222' },
                      { firstName: 'Charlie', lastName: 'Brown', ticketNumber: '33333' },
                    ]}
                    targetTicketNumber=""
                    settings={settings.spinner}
                    isSpinning={false}
                    onSpinComplete={() => {}}
                    onError={() => {}}
                    theme={settings.theme.spinnerStyle}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-night-light border-gray-800">
              <CardHeader>
                <CardTitle>Spinner Appearance</CardTitle>
                <CardDescription>Customize colors and fonts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.theme.spinnerStyle.nameColor}
                        onChange={(e) => handleStyleChange('nameColor', e.target.value)}
                        className="w-16 h-10 p-1 bg-night border-gray-700"
                      />
                      <Input
                        type="text"
                        value={settings.theme.spinnerStyle.nameColor}
                        onChange={(e) => handleStyleChange('nameColor', e.target.value)}
                        className="flex-1 bg-night border-gray-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Ticket Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.theme.spinnerStyle.ticketColor}
                        onChange={(e) => handleStyleChange('ticketColor', e.target.value)}
                        className="w-16 h-10 p-1 bg-night border-gray-700"
                      />
                      <Input
                        type="text"
                        value={settings.theme.spinnerStyle.ticketColor}
                        onChange={(e) => handleStyleChange('ticketColor', e.target.value)}
                        className="flex-1 bg-night border-gray-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.theme.spinnerStyle.backgroundColor}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        className="w-16 h-10 p-1 bg-night border-gray-700"
                      />
                      <Input
                        type="text"
                        value={settings.theme.spinnerStyle.backgroundColor}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        className="flex-1 bg-night border-gray-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Highlight Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.theme.spinnerStyle.highlightColor}
                        onChange={(e) => handleStyleChange('highlightColor', e.target.value)}
                        className="w-16 h-10 p-1 bg-night border-gray-700"
                      />
                      <Input
                        type="text"
                        value={settings.theme.spinnerStyle.highlightColor}
                        onChange={(e) => handleStyleChange('highlightColor', e.target.value)}
                        className="flex-1 bg-night border-gray-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Text Sizes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name Size</Label>
                    <Select
                      value={settings.theme.spinnerStyle.nameSize}
                      onValueChange={(value) => handleStyleChange('nameSize', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="extra-large">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Ticket Size</Label>
                    <Select
                      value={settings.theme.spinnerStyle.ticketSize}
                      onValueChange={(value) => handleStyleChange('ticketSize', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="extra-large">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Shadow Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Shadow Effects</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Top Shadow: {Math.round(settings.theme.spinnerStyle.topShadowOpacity * 100)}%</Label>
                      <Slider
                        value={[settings.theme.spinnerStyle.topShadowOpacity]}
                        onValueChange={(value) => handleStyleChange('topShadowOpacity', value[0])}
                        min={0}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Bottom Shadow: {Math.round(settings.theme.spinnerStyle.bottomShadowOpacity * 100)}%</Label>
                      <Slider
                        value={[settings.theme.spinnerStyle.bottomShadowOpacity]}
                        onValueChange={(value) => handleStyleChange('bottomShadowOpacity', value[0])}
                        min={0}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Shadow Size: {settings.theme.spinnerStyle.shadowSize}px</Label>
                    <Slider
                      value={[settings.theme.spinnerStyle.shadowSize]}
                      onValueChange={(value) => handleStyleChange('shadowSize', value[0])}
                      min={20}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-4">
            <Card className="bg-night-light border-gray-800">
              <CardHeader>
                <CardTitle>Company Branding</CardTitle>
                <CardDescription>Add your logo and company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-3">
                  <Label>Company Logo</Label>
                  {settings.theme.branding.logoImage ? (
                    <div className="relative inline-block">
                      <img 
                        src={settings.theme.branding.logoImage} 
                        alt="Company logo" 
                        className="h-20 w-auto rounded"
                      />
                      <button
                        onClick={() => handleBrandingChange('logoImage', undefined)}
                        className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full hover:bg-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 cursor-pointer inline-flex">
                      <Upload className="h-4 w-4" />
                      Upload Logo
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload('logo', file);
                          }
                        }}
                      />
                    </label>
                  )}

                  <Select
                    value={settings.theme.branding.logoPosition}
                    onValueChange={(value) => handleBrandingChange('logoPosition', value)}
                  >
                    <SelectTrigger className="bg-night border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-night-light border-gray-700">
                      <SelectItem value="left">Position: Left</SelectItem>
                      <SelectItem value="center">Position: Center</SelectItem>
                      <SelectItem value="right">Position: Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Default Banner */}
                <div className="space-y-3">
                  <Label>Default Banner</Label>
                  {settings.theme.branding.bannerImage ? (
                    <div className="relative">
                      <img 
                        src={settings.theme.branding.bannerImage} 
                        alt="Default banner" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleBrandingChange('bannerImage', undefined)}
                        className="absolute top-2 right-2 p-1 bg-red-600 rounded hover:bg-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 cursor-pointer inline-flex">
                      <Upload className="h-4 w-4" />
                      Upload Default Banner
                      <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload('banner', file);
                          }
                        }}
                      />
                    </label>
                  )}
                  <p className="text-sm text-gray-500">
                    This banner will be used when competitions don't have their own banner
                  </p>
                </div>

                {/* Company Name */}
                <div className="space-y-3">
                  <Label>Company Name</Label>
                  <Input
                    value={settings.theme.branding.companyName || ''}
                    onChange={(e) => handleBrandingChange('companyName', e.target.value)}
                    placeholder="Enter your company name"
                    className="bg-night border-gray-700"
                  />
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-company-name"
                      checked={settings.theme.branding.showCompanyName}
                      onCheckedChange={(checked) => handleBrandingChange('showCompanyName', checked)}
                    />
                    <Label htmlFor="show-company-name">Display company name with logo</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function ConfigurationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ConfigurationContent />
    </Suspense>
  );
}