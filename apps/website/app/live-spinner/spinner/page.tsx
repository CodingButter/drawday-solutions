'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CompetitionProvider, useCompetitions } from '@/contexts';
import { SettingsProvider, useSettings } from '@/contexts';
import { ThemeProvider, useTheme } from '@/contexts';
import { useExtensionBridge } from '@/hooks/useExtensionBridge';
import { getExtensionBridge } from '@/lib/extension-bridge';
import { getStoredUser, isAuthenticated } from '@/lib/directus-auth';
import { SlotMachineWheel } from '@raffle-spinner/spinners';
import { SessionWinners, Winner } from '@/components/sidepanel/SessionWinners';
import { Button } from '@raffle-spinner/ui';
import { Input } from '@raffle-spinner/ui';
import { Card, CardContent } from '@raffle-spinner/ui';
import { Label } from '@raffle-spinner/ui';
import { ThemeApplier } from '@raffle-spinner/ui';
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
  const [loading, setLoading] = useState(true);
  const { isInIframe, authToken, notifySpinnerComplete } = useExtensionBridge();
  const { competitions, selectedCompetition, selectCompetition, refreshCompetitions } =
    useCompetitions();
  const { settings } = useSettings();
  const { theme } = useTheme();
  const [ticketNumber, setTicketNumber] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [sessionWinners, setSessionWinners] = useState<Winner[]>([]);
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  // Auth check - require proper Directus authentication
  useEffect(() => {
    const checkAuth = async () => {
      const directusUser = getStoredUser();
      if (directusUser && isAuthenticated()) {
        setUser({
          uid: directusUser.id,
          email: directusUser.email,
          displayName: directusUser.first_name || directusUser.email,
        });
        setLoading(false);

        // Initial refresh of competitions from context
        refreshCompetitions();
      } else {
        // Not authenticated, redirect to extension-specific login
        setLoading(false);
        router.push('/live-spinner/auth/login?returnTo=/live-spinner/spinner');
      }
    };

    checkAuth();
  }, [router, refreshCompetitions]);

  // Listen for competition updates from extension bridge (only when user is authenticated)
  useEffect(() => {
    if (!user) return;

    const bridge = getExtensionBridge();

    // Use the correct onSettingsUpdate method which returns an unsubscribe function
    const unsubscribe = bridge.onSettingsUpdate(() => {
      refreshCompetitions();
    });

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [user, refreshCompetitions]);

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

    const participant = selectedCompetition.participants?.find(
      (p: any) => normalizeTicketNumber(p.ticketNumber) === normalizedInput
    );

    if (!participant) {
      setError('Ticket number not found in this competition');
      return;
    }

    setIsSpinning(true);
    setCurrentWinner(null);
  };

  const confettiRef = useRef<boolean>(false);

  const handleSpinComplete = async (winner: Participant) => {
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

    // Record draw to Directus
    try {
      const token = localStorage.getItem('directus_auth_token');
      if (token && selectedCompetition) {
        await fetch('/api/draw-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            raffle_id: selectedCompetition.id,
            spinner_type: settings.spinnerType || 'slot_machine',
            participant_data: {
              firstName: winner.firstName,
              lastName: winner.lastName,
              ticketNumber: winner.ticketNumber,
            },
            winner_data: {
              ticketNumber: winner.ticketNumber,
              name: `${winner.firstName} ${winner.lastName}`,
            },
            spin_duration: settings.minSpinDuration || 3,
            draw_number: sessionWinners.length + 1,
            metadata: {
              session_id: sessionStorage.getItem('session_id') || Date.now().toString(),
            },
          }),
        });
      }
    } catch (error) {
      console.error('Failed to record draw:', error);
      // Don't show error to user, just log it
    }

    // Notify extension if in iframe
    notifySpinnerComplete(winner);

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

  // Load banner image - show company banner by default, competition banner when selected
  useEffect(() => {
    if (selectedCompetition?.bannerImageId) {
      // Competition has its own banner - use direct Directus URL
      const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://db.drawday.app';
      const bannerUrl = `${directusUrl}/assets/${selectedCompetition.bannerImageId}`;
      setBannerImage(bannerUrl);
    } else if (theme?.branding?.bannerImage) {
      // Use company branding banner (already a data URL)
      setBannerImage(theme.branding.bannerImage);
    } else {
      setBannerImage(null);
    }
  }, [selectedCompetition?.bannerImageId, theme?.branding?.bannerImage]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto p-4">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ThemeApplier colors={theme?.colors} />
      <div className="min-h-screen bg-background">
        {/* Branding Header - Show when there's a banner or logo */}
        {(bannerImage || (theme?.branding?.logoImage && theme?.branding?.logoImage.trim())) && (
          <div className="relative">
            {/* Banner - either competition or company */}
            {bannerImage && (
              <div className="w-full h-48 overflow-hidden">
                <img src={bannerImage} alt="Event Banner" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Logo and Company Name - Show if logo exists */}
            {theme?.branding?.logoImage && theme.branding.logoImage.trim() && (
              <div
                className={`${bannerImage ? 'absolute inset-0' : 'relative py-8'} flex items-center px-4 ${
                  theme?.branding?.logoPosition === 'center'
                    ? 'justify-center'
                    : theme?.branding?.logoPosition === 'right'
                      ? 'justify-end'
                      : 'justify-start'
                }`}
              >
                <div className="flex items-center gap-3 bg-background/70 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg border border-white/10">
                  <img src={theme.branding.logoImage} alt="Company Logo" className="h-16 w-auto" />
                  {theme?.branding?.showCompanyName && theme?.branding?.companyName && (
                    <span className="text-2xl font-bold">{theme.branding.companyName}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="max-w-2xl mx-auto space-y-4 p-4">
          {/* Competition Selector - Minimal UI */}
          <div className="flex gap-2 relative z-20">
            <Select
              value={selectedCompetition?.id || ''}
              onValueChange={(value) => {
                const competition = competitions.find((c: any) => c.id === value);
                if (competition) selectCompetition(competition);
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a competition" />
              </SelectTrigger>
              <SelectContent>
                {competitions.map((competition: any) => (
                  <SelectItem key={competition.id} value={competition.id}>
                    {competition.name} ({competition.participants?.length || 0} participants)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InfoTooltip {...helpContent.competitionSelector} />
          </div>

          {selectedCompetition ? (
            <>
              {/* Spinner Section */}
              <Card className="bg-background/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="aspect-square max-w-md mx-auto mb-6 relative z-0 overflow-hidden">
                    <SlotMachineWheel
                      participants={selectedCompetition.participants || []}
                      targetTicketNumber={ticketNumber}
                      isSpinning={isSpinning}
                      onSpinComplete={handleSpinComplete}
                      settings={{
                        spinDuration: settings?.spinDuration || 'medium',
                        decelerationSpeed: settings?.decelerationSpeed || 'medium',
                      }}
                      className="w-full h-full relative z-0"
                      theme={
                        theme?.spinnerStyle
                          ? {
                              nameColor: theme.spinnerStyle.nameColor,
                              ticketColor: theme.spinnerStyle.ticketColor,
                              backgroundColor: theme.spinnerStyle.backgroundColor,
                              canvasBackground: theme.spinnerStyle.canvasBackground,
                              borderColor: theme.spinnerStyle.borderColor,
                              highlightColor: theme.spinnerStyle.highlightColor,
                              nameSize: theme.spinnerStyle.nameSize as
                                | 'small'
                                | 'medium'
                                | 'large'
                                | 'extra-large',
                              ticketSize: theme.spinnerStyle.ticketSize as
                                | 'small'
                                | 'medium'
                                | 'large'
                                | 'extra-large',
                              fontFamily: theme.spinnerStyle.fontFamily,
                              topShadowOpacity: theme.spinnerStyle.topShadowOpacity,
                              bottomShadowOpacity: theme.spinnerStyle.bottomShadowOpacity,
                              shadowSize: theme.spinnerStyle.shadowSize,
                              shadowColor: theme.spinnerStyle.shadowColor,
                            }
                          : undefined
                      }
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
                  <div className="space-y-4 relative z-20">
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
                          autoComplete="off"
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
          ) : (
            // No competition selected - show prompt
            <Card className="bg-background/80 backdrop-blur">
              <CardContent className="p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No Competition Selected</h3>
                <p className="text-muted-foreground">
                  Please select a competition from the dropdown above to start the raffle
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
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
