'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser, isAuthenticated, logout } from '@/lib/directus-auth';
import { clearLargeStorageItems } from '@/lib/clear-storage';
import { useExtensionBridge } from '@/hooks/useExtensionBridge';
import { CompetitionProvider, useCompetitions } from '@/contexts';
import { SettingsProvider, useSettings } from '@/contexts';
import { ThemeProvider, useTheme } from '@/contexts';
import { CollapsibleStateProvider, useCollapsibleState } from '@/contexts';
import { ThemeApplier } from '@raffle-spinner/ui';
import { useCSVImport } from '@raffle-spinner/hooks';
import { CompetitionManagementContent } from '@/components/options/CompetitionManagementContent';
import { CSVUploadModal } from '@/components/options/CSVUploadModal';
import { ColumnMapper } from '@raffle-spinner/ui';
import { DuplicateHandler } from '@/components/options/DuplicateHandler';
import { DeleteConfirmDialog } from '@/components/options/DeleteConfirmDialog';
import { TicketConversionDialog } from '@/components/options/TicketConversionDialog';
import { SpinnerSettings } from '@/components/options/SpinnerSettings';
import { SpinnerCustomization } from '@/components/options/SpinnerCustomization';
import { ThemeColors } from '@/components/options/ThemeColors';
import { BrandingSettings } from '@/components/options/BrandingSettings';
import { SavedMappingsManager } from '@/components/options/SavedMappingsManager';
import { Alert, AlertDescription } from '@raffle-spinner/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@raffle-spinner/ui';
import { Button } from '@raffle-spinner/ui';
import { CheckCircle, ChevronDown, ChevronRight, User, LogOut, Mail, Play } from 'lucide-react';
import type { Competition } from '@/contexts';

function OptionsContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isInIframe, isExtension, openSidePanel, saveAuthToken } = useExtensionBridge();
  const { competitions, addCompetition, deleteCompetition, clearAllCompetitions, updateCompetitionBanner } =
    useCompetitions();
  const { settings, columnMapping, updateSettings, updateColumnMapping } = useSettings();
  const { collapsedSections, toggleSection } = useCollapsibleState();
  const { theme } = useTheme();

  const [competitionToDelete, setCompetitionToDelete] = useState<Competition | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);

  // Debug state changes
  useEffect(() => {
  }, [showDeleteDialog, competitionToDelete]);

  // Auth check - require proper Directus authentication
  useEffect(() => {
    // Clear any large localStorage items on load to prevent quota issues
    clearLargeStorageItems();

    const checkAuth = async () => {
      const directusUser = getStoredUser();
      if (directusUser && isAuthenticated()) {
        setUser({
          uid: directusUser.id,
          email: directusUser.email,
          displayName: directusUser.first_name || directusUser.email,
        });

        // Get and save auth token for extension
        const token = localStorage.getItem('directus_token');
        if (token) {
          saveAuthToken(token);
        }

        setLoading(false);
      } else {
        // Not authenticated, redirect to login with proper redirect parameter
        // Only redirect if not in iframe (extension handles auth differently)
        if (!isInIframe) {
          setLoading(false);
          router.push('/auth/login?redirect=/live-spinner/options');
        }
      }
    };

    checkAuth();
  }, [router, isInIframe, saveAuthToken]);

  const {
    fileInputRef,
    selectedFile,
    showNameModal,
    showMapperModal,
    showDuplicateModal,
    showConversionModal,
    detectedHeaders,
    detectedMapping,
    duplicates,
    ticketConversions,
    importSummary,
    savedMappings,
    suggestedMappingId,
    handleFileSelect,
    handleMappingConfirm,
    handleNameConfirm,
    handleDuplicateProceed,
    handleConversionProceed,
    setShowNameModal,
    setShowMapperModal,
    setShowDuplicateModal,
    setShowConversionModal,
    openMapperModal,
  } = useCSVImport({
    addCompetition,
    columnMapping,
    updateColumnMapping,
  });

  const handleDeleteClick = (id: string) => {
    const competition = competitions.find((c) => c.id === id);
    if (competition) {
      // Set both states at the same time
      setCompetitionToDelete(competition);
      setShowDeleteDialog(true);
    } else {
    }
  };

  const handleDeleteConfirm = async () => {
    if (competitionToDelete) {
      try {
        await deleteCompetition(competitionToDelete.id);
        setCompetitionToDelete(null);
        setShowDeleteDialog(false);
      } catch (error) {
        alert('Failed to delete raffle. Please try again.');
      }
    }
  };

  const handleDeleteCancel = () => {
    setCompetitionToDelete(null);
    setShowDeleteDialog(false);
  };

  const handleClearAllClick = () => {
    setShowClearAllDialog(true);
  };

  const handleClearAllConfirm = async () => {
    try {
      await clearAllCompetitions();
      setShowClearAllDialog(false);
    } catch (error) {
      alert('Failed to clear all raffles. Please try again.');
    }
  };

  const handleClearAllCancel = () => {
    setShowClearAllDialog(false);
  };

  const handleUpdateBanner = async (id: string, banner: string | undefined) => {
    if (banner) {
      // New banner uploaded
      await updateCompetitionBanner(id, banner);
    } else {
      // Banner removed - need to delete from IndexedDB
      const competition = competitions.find(c => c.id === id);
      if (competition?.bannerImageId) {
        const { imageStore } = await import('@/lib/image-utils');
        await imageStore.deleteImage(competition.bannerImageId);
      }
      // Clear the banner reference
      await updateCompetitionBanner(id, '');
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Clear any local storage
      localStorage.clear();
      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      setIsLoggingOut(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }


  return (
    <>
      <ThemeApplier colors={theme?.colors} />
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Raffle Spinner Configuration</h1>
            <p className="text-muted-foreground mt-2">
              Manage competitions and customize spinner settings
            </p>
          </div>

          {/* Open Spinner Button - shows for extension or standalone */}
          <Button
            variant="default"
            className="mr-4"
            onClick={openSidePanel}
          >
            <Play className="h-4 w-4 mr-2" />
            Open Spinner
          </Button>

          {/* User Account Info */}
          <Card className="w-80">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium">Account</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-3 w-3 mr-2" />
                  {user.email}
                </div>
                {user.displayName && (
                  <div className="text-sm font-medium">{user.displayName}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {importSummary && (
          <Alert variant={importSummary.success ? 'default' : 'destructive'}>
            {importSummary.success && <CheckCircle className="h-4 w-4" />}
            <AlertDescription>{importSummary.message}</AlertDescription>
          </Alert>
        )}

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader
            className="cursor-pointer select-none transition-colors duration-200 hover:bg-muted/50 rounded-t-lg"
            onClick={() => toggleSection('competitions')}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Competition Management</CardTitle>
                <CardDescription>Import and manage raffle competitions</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                aria-label={collapsedSections.competitions ? "Expand Competition Management" : "Collapse Competition Management"}
                aria-expanded={!collapsedSections.competitions}
              >
                {collapsedSections.competitions ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {!collapsedSections.competitions && (
            <CardContent>
              <CompetitionManagementContent
                competitions={competitions}
                columnMapping={columnMapping}
                fileInputRef={fileInputRef}
                onFileSelect={handleFileSelect}
                onDeleteCompetition={handleDeleteClick}
                onClearAll={handleClearAllClick}
                onOpenMapper={openMapperModal}
                onUpdateBanner={handleUpdateBanner}
              />
            </CardContent>
          )}
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader
            className="cursor-pointer select-none transition-colors duration-200 hover:bg-muted/50 rounded-t-lg"
            onClick={() => toggleSection('settings')}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Spinner Settings</CardTitle>
                <CardDescription>Configure spin duration and physics</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                aria-label={collapsedSections.settings ? "Expand Spinner Settings" : "Collapse Spinner Settings"}
                aria-expanded={!collapsedSections.settings}
              >
                {collapsedSections.settings ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {!collapsedSections.settings && (
            <CardContent>
              <SpinnerSettings settings={settings} onUpdate={updateSettings} />
            </CardContent>
          )}
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="cursor-pointer select-none transition-colors duration-200 hover:bg-muted/50 rounded-t-lg" onClick={() => toggleSection('theme')}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Spinner Appearance</CardTitle>
                <CardDescription>Customize the look of your spinner</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                aria-label={collapsedSections.theme ? "Expand Spinner Appearance" : "Collapse Spinner Appearance"}
                aria-expanded={!collapsedSections.theme}
              >
                {collapsedSections.theme ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {!collapsedSections.theme && (
            <CardContent>
              <SpinnerCustomization />
              <div className="mt-6">
                <ThemeColors />
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader
            className="cursor-pointer select-none transition-colors duration-200 hover:bg-muted/50 rounded-t-lg"
            onClick={() => toggleSection('branding')}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Add your logo and company information</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                aria-label={collapsedSections.branding ? "Expand Branding" : "Collapse Branding"}
                aria-expanded={!collapsedSections.branding}
              >
                {collapsedSections.branding ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {!collapsedSections.branding && (
            <CardContent>
              <BrandingSettings />
            </CardContent>
          )}
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="cursor-pointer select-none transition-colors duration-200 hover:bg-muted/50 rounded-t-lg" onClick={() => toggleSection('help')}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>CSV Column Mappings</CardTitle>
                <CardDescription>Manage saved column mapping templates</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                aria-label={collapsedSections.help ? "Expand CSV Column Mappings" : "Collapse CSV Column Mappings"}
                aria-expanded={!collapsedSections.help}
              >
                {collapsedSections.help ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {!collapsedSections.help && (
            <CardContent>
              <SavedMappingsManager />
            </CardContent>
          )}
        </Card>

        {/* Modals */}
        <CSVUploadModal
          open={showNameModal}
          onClose={() => setShowNameModal(false)}
          onConfirm={handleNameConfirm}
          fileName={selectedFile?.name || ''}
        />

        <ColumnMapper
          open={showMapperModal}
          onClose={() => {
            setShowMapperModal(false);
          }}
          headers={detectedHeaders}
          detectedMapping={detectedMapping}
          onConfirm={handleMappingConfirm}
          savedMappings={savedMappings}
          suggestedMappingId={suggestedMappingId}
          onSaveMapping={async (mapping) => {
            // Save to localStorage for website
            const existingMappings = savedMappings || [];
            const updatedMappings = [...existingMappings.filter(m => m.id !== mapping.id), mapping];
            localStorage.setItem('savedMappings', JSON.stringify(updatedMappings));
          }}
        />

        <DuplicateHandler
          open={showDuplicateModal}
          duplicates={duplicates}
          onProceed={handleDuplicateProceed}
          onCancel={() => setShowDuplicateModal(false)}
        />

        <TicketConversionDialog
          open={showConversionModal}
          conversions={ticketConversions}
          onProceed={handleConversionProceed}
          onCancel={() => setShowConversionModal(false)}
        />

        <DeleteConfirmDialog
          open={showDeleteDialog}
          competition={competitionToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
        <DeleteConfirmDialog
          open={showClearAllDialog}
          competition={null}
          onConfirm={handleClearAllConfirm}
          onCancel={handleClearAllCancel}
          isClearAll={true}
        />
      </div>
    </div>
    </>
  );
}

export default function OptionsPage() {
  return (
    <ThemeProvider>
      <CompetitionProvider>
        <SettingsProvider>
          <CollapsibleStateProvider>
            <OptionsContent />
          </CollapsibleStateProvider>
        </SettingsProvider>
      </CompetitionProvider>
    </ThemeProvider>
  );
}