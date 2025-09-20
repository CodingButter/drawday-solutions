/**
 * Competition Management Content Component
 *
 * Card-less version of CompetitionManagement for use in collapsible sections
 */

// Storage types are now in contexts;
import { logger } from '@raffle-spinner/utils';
import { Button } from '@raffle-spinner/ui';
import { Upload, Settings, Play, Trash2 } from 'lucide-react';
import { CompetitionList } from './CompetitionList';
import { openSpinnerPanel } from '@/lib/sidepanel-handler';
import type { Competition, ColumnMapping } from '@/contexts';

interface CompetitionManagementContentProps {
  competitions: Competition[];
  columnMapping: ColumnMapping | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteCompetition: (id: string) => void;
  onClearAll?: () => void;
  onOpenMapper: () => void;
  onUpdateBanner?: (id: string, banner: string | undefined) => void;
}

export function CompetitionManagementContent({
  competitions,
  columnMapping,
  fileInputRef,
  onFileSelect,
  onDeleteCompetition,
  onClearAll,
  onOpenMapper,
  onUpdateBanner,
}: CompetitionManagementContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={onFileSelect}
        />
        <Button onClick={() => fileInputRef.current?.click()}>
          <Upload className="w-4 h-4 mr-2" />
          Upload CSV
        </Button>
        <Button variant="outline" onClick={onOpenMapper}>
          <Settings className="w-4 h-4 mr-2" />
          {columnMapping ? 'Edit Column Mapping' : 'Set Column Mapping'}
        </Button>
        <Button
          variant="outline"
          onClick={openSpinnerPanel}
          title="Open Spinner Panel"
        >
          <Play className="w-4 h-4 mr-2" />
          Open Spinner
        </Button>
        {competitions.length > 0 && onClearAll && (
          <Button
            variant="destructive"
            onClick={onClearAll}
            title="Delete all competitions"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {columnMapping && (
        <div className="text-sm text-muted-foreground">
          Current mapping: {columnMapping.firstName} → First Name, {columnMapping.lastName} → Last
          Name, {columnMapping.ticketNumber} → Ticket
        </div>
      )}

      <CompetitionList
        competitions={competitions}
        onDelete={onDeleteCompetition}
        onUpdateBanner={onUpdateBanner}
      />
    </div>
  );
}
