'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { CompetitionProvider, useCompetitions } from '@/contexts';
import { SettingsProvider, useSettings } from '@/contexts';
import { ThemeProvider, useTheme } from '@/contexts';
import { useLocalStoragePolling } from '@/hooks/useLocalStoragePolling';
import { SlotMachineWheel } from '@raffle-spinner/spinners';
import { SessionWinners, Winner } from '@/components/sidepanel/SessionWinners';
import { Button } from '@raffle-spinner/ui';
import { Input } from '@raffle-spinner/ui';
import { Card, CardContent } from '@raffle-spinner/ui';
import { Label } from '@raffle-spinner/ui';
import { normalizeTicketNumber } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@raffle-spinner/ui';
import { Alert, AlertDescription } from '@raffle-spinner/ui';
import { Sparkles, AlertCircle } from 'lucide-react';
import { InfoTooltip } from '@raffle-spinner/ui';
import { helpContent } from '@/lib/help-content';
import type { Participant } from '@/contexts';
import confetti from 'canvas-confetti';

function SidePanelContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { competitions, selectedCompetition, selectCompetition, refreshCompetitions } = useCompetitions();
  const { settings, refreshSettings } = useSettings();
  const { theme } = useTheme();
  const [ticketNumber, setTicketNumber] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [sessionWinners, setSessionWinners] = useState<Winner[]>([]);
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Poll localStorage for live updates
  useLocalStoragePolling({
    key: 'competitions',
    interval: 500,
    onUpdate: async (value) => {
      if (value) {
        // Refresh from database to get latest data
        await refreshCompetitions();
      }
    }
  });

  // Theme updates are handled by ThemeContext's own polling mechanism
  // No need to poll for theme updates here

  useLocalStoragePolling({
    key: 'settings',
    interval: 500,
    onUpdate: async () => {
      // Refresh settings from database
      if (refreshSettings) {
        await refreshSettings();
      }
    }
  });

  useLocalStoragePolling({
    key: 'selectedCompetition',
    interval: 500,
    onUpdate: (value) => {
      if (value && value.id !== selectedCompetition?.id) {
        selectCompetition(value);
      }
    }
  });

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        router.push('/login?from=/live-spinner/spinner');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSpin = () => {
    setError(null);

    if (!selectedCompetition) {
      setError('Please select a competition first');
      return;
    }

    if (!ticketNumber) {
      setError('Please enter a ticket number');
      return;
    }

    // Use shared utility for ticket normalization
    const normalizedInput = normalizeTicketNumber(ticketNumber);
    
    console.log('Searching for ticket:', ticketNumber, 'normalized:', normalizedInput);
    console.log('Available participants:', selectedCompetition.participants.map(p => ({
      ticket: p.ticketNumber,
      normalized: normalizeTicketNumber(p.ticketNumber)
    })));

    const participant = selectedCompetition.participants.find(
      (p) => normalizeTicketNumber(p.ticketNumber) === normalizedInput
    );

    if (!participant) {
      setError('Ticket number not found in this competition');
      console.error('Ticket not found:', normalizedInput, 'in competition:', selectedCompetition.name);
      return;
    }

    console.log('Starting spin for participant:', participant);
    setIsSpinning(true);
    setCurrentWinner(null);
  };

  const confettiRef = useRef<boolean>(false);

  const handleSpinComplete = (winner: Participant) => {
    setIsSpinning(false);
    setCurrentWinner(winner);

    // Add to session winners
    setSessionWinners((prev) => [
      {
        firstName: winner.firstName,
        lastName: winner.lastName,
        ticketNumber: winner.ticketNumber,
        competition: selectedCompetition!.name,
        timestamp: Date.now(),
      },
      ...prev,
    ]);

    // Trigger confetti animation with guard against double-firing
    if (!confettiRef.current) {
      confettiRef.current = true;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Reset the guard after animation
      setTimeout(() => {
        confettiRef.current = false;
      }, 1000);
    }

    // Clear the ticket input for next spin
    setTimeout(() => {
      setTicketNumber('');
      setCurrentWinner(null);
    }, 5000);
  };

  // Determine which banner to show
  const bannerImage = selectedCompetition?.bannerImage || theme.branding.bannerImage;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto p-4">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Branding Header */}
      {(bannerImage || theme.branding.logoImage) && (
        <div className="relative">
          {/* Banner */}
          {bannerImage && (
            <div className="w-full h-48 overflow-hidden">
              <img src={bannerImage} alt="Event Banner" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Logo and Company Name - Centered in banner */}
          {theme.branding.logoImage && (
            <div
              className={`${bannerImage ? 'absolute inset-0' : 'relative py-8'} flex items-center px-4 ${
                theme.branding.logoPosition === 'center'
                  ? 'justify-center'
                  : theme.branding.logoPosition === 'right'
                    ? 'justify-end'
                    : 'justify-start'
              }`}
            >
              <div className="flex items-center gap-3 bg-background/70 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg border border-white/10">
                <img src={theme.branding.logoImage} alt="Company Logo" className="h-16 w-auto" />
                {theme.branding.showCompanyName && theme.branding.companyName && (
                  <span className="text-2xl font-bold">{theme.branding.companyName}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-4 p-4">
        {/* Competition Selector - Minimal UI */}
        <div className="flex gap-2">
          <Select
            value={selectedCompetition?.id || ''}
            onValueChange={(value) => {
              const competition = competitions.find((c) => c.id === value);
              if (competition) selectCompetition(competition);
            }}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a competition" />
            </SelectTrigger>
            <SelectContent>
              {competitions.map((competition) => (
                <SelectItem key={competition.id} value={competition.id}>
                  {competition.name} ({competition.participants.length} participants)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <InfoTooltip {...helpContent.competitionSelector} />
        </div>

        {selectedCompetition && (
          <>
            {/* Spinner Section */}
            <Card className="bg-background/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="aspect-square max-w-md mx-auto mb-6">
                  <SlotMachineWheel
                    participants={selectedCompetition.participants}
                    targetTicketNumber={ticketNumber}
                    isSpinning={isSpinning}
                    onSpinComplete={handleSpinComplete}
                    settings={settings}
                    theme={theme.spinnerStyle}
                  />
                </div>

                {/* Winner Display */}
                {currentWinner && (
                  <div className="text-center mb-6 animate-bounce">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                      <Sparkles className="h-5 w-5" />
                      Winner: {currentWinner.firstName} {currentWinner.lastName}
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>
                )}

                {/* Input Controls */}
                <div className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="ticket" className="sr-only">
                        Ticket Number
                      </Label>
                      <Input
                        id="ticket"
                        placeholder="Enter ticket number"
                        value={ticketNumber}
                        onChange={(e) => setTicketNumber(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isSpinning && handleSpin()}
                        disabled={isSpinning}
                        className="text-center text-lg"
                      />
                    </div>
                    <Button
                      onClick={handleSpin}
                      disabled={isSpinning || !ticketNumber}
                      size="lg"
                      className="px-8"
                    >
                      {isSpinning ? 'Spinning...' : 'SPIN'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Winners */}
            {sessionWinners.length > 0 && <SessionWinners winners={sessionWinners} />}
          </>
        )}
      </div>
    </div>
  );
}

export default function SpinnerPage() {
  return (
    <ThemeProvider>
      <CompetitionProvider>
        <SettingsProvider>
          <SidePanelContent />
        </SettingsProvider>
      </CompetitionProvider>
    </ThemeProvider>
  );
}