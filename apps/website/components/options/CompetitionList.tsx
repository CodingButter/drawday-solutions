/**
 * Competition List Component
 *
 * Purpose: Displays list of imported competitions with participant counts,
 * creation dates, and deletion functionality for competition management.
 *
 * SRS Reference:
 * - FR-1.6: Competition Management
 */

import { useState, useEffect } from 'react';
import type { Competition } from '@/contexts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@raffle-spinner/ui';
import { Alert, AlertDescription } from '@raffle-spinner/ui';
import { ImageUpload } from '@raffle-spinner/ui';
import { Trash2, Users, AlertCircle } from 'lucide-react';
import { imageStore } from '@/lib/image-utils';

interface CompetitionListProps {
  competitions: Competition[];
  onDelete: (id: string) => void;
  onUpdateBanner?: (id: string, banner: string | undefined) => void;
}

// Component to handle loading banner from IndexedDB
function CompetitionBanner({
  competition,
  onUpdateBanner,
}: {
  competition: Competition;
  onUpdateBanner?: (id: string, banner: string | undefined) => void;
}) {
  const [bannerUrl, setBannerUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBanner = async () => {
      if (competition.bannerImageId) {
        setLoading(true);
        try {
          const image = await imageStore.getImage(competition.bannerImageId);
          setBannerUrl(image || undefined);
        } catch (error) {
          console.error('Error loading banner:', error);
          setBannerUrl(undefined);
        } finally {
          setLoading(false);
        }
      } else {
        // Clear banner if no bannerImageId
        setBannerUrl(undefined);
      }
    };
    loadBanner();
  }, [competition.bannerImageId, competition.id]); // Add competition.id to dependencies to force refresh

  const handleBannerChange = async (value: string | undefined) => {
    // Set loading state while updating
    setLoading(true);

    // Update the banner
    await onUpdateBanner?.(competition.id, value);

    // The parent component will update the competition state,
    // which will trigger the useEffect to reload the banner
    setLoading(false);
  };

  return (
    <ImageUpload
      key={`${competition.id}-${competition.bannerImageId || 'no-banner'}`} // Add key to force re-render
      value={bannerUrl}
      onChange={handleBannerChange}
      onError={(error) => console.error('Upload error:', error)}
      height="h-24"
      compact
      loading={loading}
    />
  );
}

export function CompetitionList({ competitions, onDelete, onUpdateBanner }: CompetitionListProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (competitions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No competitions yet. Upload a CSV file to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {competitions.map((competition) => (
        <Card key={competition.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <div className="space-y-1">
              <CardTitle className="text-lg">{competition.name}</CardTitle>
              <CardDescription>{competition.participants.length} participants</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-delete-competition={competition.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Delete button clicked - event:', e.type);
                  console.log('Delete clicked for competition:', competition.id, competition.name);
                  onDelete(competition.id);
                }}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 text-destructive hover:text-destructive/90 hover:bg-destructive/10 cursor-pointer relative z-10"
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                aria-label={`Delete ${competition.name}`}
              >
                <Trash2 className="h-4 w-4 pointer-events-none" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Competition Banner */}
              <CompetitionBanner competition={competition} onUpdateBanner={onUpdateBanner} />

              <div className="text-xs text-muted-foreground">
                Created:{' '}
                {competition.createdAt
                  ? new Date(competition.createdAt).toLocaleDateString()
                  : 'Unknown date'}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
