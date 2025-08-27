'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { CompetitionProvider, useCompetitions } from '@/contexts';
import { SettingsProvider, useSettings } from '@/contexts';
import { ThemeProvider } from '@/contexts';
import { CollapsibleStateProvider, useCollapsibleState } from '@/contexts';
import { useCSVImport } from '@/hooks/useCSVImport';
import { CompetitionManagementContent } from '@/components/options/CompetitionManagementContent';
import { CSVUploadModal } from '@/components/options/CSVUploadModal';
import { ColumnMapper } from '@/components/options/ColumnMapper';
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
import { CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import type { Competition } from '@/contexts';

function OptionsContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isInIframe, setIsInIframe] = useState(false);
  const { competitions, addCompetition, deleteCompetition, updateCompetitionBanner } =
    useCompetitions();
  const { settings, columnMapping, updateSettings, updateColumnMapping } = useSettings();
  const { collapsedSections, toggleSection } = useCollapsibleState();

  const [competitionToDelete, setCompetitionToDelete] = useState<Competition | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Check if we're in an iframe
  useEffect(() => {
    setIsInIframe(window !== window.parent);
  }, []);

  // Auth check - skip if in iframe (extension handles auth)
  useEffect(() => {
    if (isInIframe) {
      // In iframe/extension context, assume authenticated
      setUser({
        uid: 'extension-user',
        email: 'user@extension',
        displayName: 'Extension User',
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        router.push('/login?from=/live-spinner/options');
      }
    });

    return () => unsubscribe();
  }, [router, isInIframe]);

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
      setCompetitionToDelete(competition);
      setShowDeleteDialog(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (competitionToDelete) {
      await deleteCompetition(competitionToDelete.id);
      setCompetitionToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setCompetitionToDelete(null);
    setShowDeleteDialog(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Raffle Spinner Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Manage competitions and customize spinner settings
          </p>
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
                onOpenMapper={openMapperModal}
                onUpdateBanner={updateCompetitionBanner}
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
          onClose={() => setShowMapperModal(false)}
          headers={detectedHeaders}
          detectedMapping={detectedMapping}
          onConfirm={handleMappingConfirm}
          savedMappings={savedMappings}
          suggestedMappingId={suggestedMappingId}
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
      </div>
    </div>
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