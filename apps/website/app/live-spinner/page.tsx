'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserSettings, type UserSettings } from '@/lib/settings-service';
import { getStoredUser, isAuthenticated } from '@/lib/directus-auth';
import { getUserCompetitions, getCompetition, updateCompetition, type Competition } from '@/lib/directus-competitions';
import { SlotMachineWheel, type SpinnerTheme } from '@raffle-spinner/spinners';
import { Button } from '@raffle-spinner/ui';
import { Input } from '@raffle-spinner/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@raffle-spinner/ui';
import { Label } from '@raffle-spinner/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@raffle-spinner/ui';
import { Alert, AlertDescription } from '@raffle-spinner/ui';
import { Sparkles, AlertCircle, Trophy, Users, Upload } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CSVParser, IntelligentColumnMapper } from '@raffle-spinner/csv-parser';

interface Participant {
  firstName: string;
  lastName: string;
  ticketNumber: string;
}

interface Winner {
  firstName: string;
  lastName: string;
  ticketNumber: string;
  competition: string;
  timestamp: number;
}



export default function LiveSpinnerPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [ticketNumber, setTicketNumber] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [sessionWinners, setSessionWinners] = useState<Winner[]>([]);
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingCsv, setUploadingCsv] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const confettiRef = useRef<boolean>(false);

  // Load user and competitions
  useEffect(() => {
    const checkAuth = async () => {
      const directusUser = getStoredUser();
      if (directusUser && isAuthenticated()) {
        setUser({
          uid: directusUser.id,
          email: directusUser.email,
          displayName: directusUser.first_name || directusUser.email,
        });
        
        // Load user's competitions and settings
        try {
          const [userCompetitions, settings] = await Promise.all([
            getUserCompetitions(),
            getUserSettings(directusUser.id)
          ]);
          
          setCompetitions(userCompetitions);
          setUserSettings(settings);
          
          // Auto-select first competition if available
          if (userCompetitions.length > 0) {
            // Load full competition data for the first one
            const fullComp = await getCompetition(userCompetitions[0].id!);
            if (fullComp) {
              setSelectedCompetition(fullComp);
            }
          }
        } catch (err) {
          console.error('Error loading data:', err);
          setError('Failed to load data');
        }
        
        setLoading(false);
      } else {
        // Not authenticated, redirect to login
        router.push('/login?from=/live-spinner');
      }
    };
    
    checkAuth();
  }, [router]);

  const normalizeTicketNumber = (ticket: string): string => {
    return ticket.replace(/\D/g, '');
  };

  const handleSpin = () => {
    setError(null);

    if (!selectedCompetition) {
      setError('Please select a competition first');
      return;
    }

    if (!selectedCompetition.participants || selectedCompetition.participants.length === 0) {
      setError('No participants in this competition');
      return;
    }

    if (!ticketNumber) {
      setError('Please enter a ticket number');
      return;
    }

    const normalizedInput = normalizeTicketNumber(ticketNumber);

    const participant = selectedCompetition.participants.find(
      (p) => normalizeTicketNumber(p.ticketNumber) === normalizedInput
    );

    if (!participant) {
      setError('Ticket number not found in this competition');
      return;
    }

    setIsSpinning(true);
    setCurrentWinner(null);
  };

  const handleSpinComplete = async (winner: Participant) => {
    setIsSpinning(false);
    setCurrentWinner(winner);

    // Add to session winners
    const newWinner: Winner = {
      firstName: winner.firstName,
      lastName: winner.lastName,
      ticketNumber: winner.ticketNumber,
      competition: selectedCompetition!.name,
      timestamp: Date.now(),
    };
    
    setSessionWinners((prev) => [newWinner, ...prev]);

    // Save winner to Directus if it's a saved competition
    if (selectedCompetition?.id && !selectedCompetition.id.startsWith('temp-')) {
      try {
        const existingWinners = selectedCompetition.winners || [];
        await updateCompetition(selectedCompetition.id, {
          winners: [
            ...existingWinners,
            {
              participant: winner,
              timestamp: Date.now(),
            },
          ]
        });
      } catch (err) {
        console.error('Error saving winner:', err);
      }
    }

    // Trigger confetti animation
    if (!confettiRef.current) {
      confettiRef.current = true;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCsv(true);
    setError(null);

    try {
      const parser = new CSVParser();
      const detector = new IntelligentColumnMapper();
      
      // Detect columns
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const columnMapping = detector.detectHeaders(headers);
      
      if (!columnMapping.ticketNumber || (!columnMapping.fullName && (!columnMapping.firstName || !columnMapping.lastName))) {
        throw new Error('Could not detect required columns in CSV');
      }
      
      // Parse CSV
      const parseResult = await parser.parse(file, columnMapping);
      
      if (parseResult.participants.length === 0) {
        throw new Error('No valid participants found in CSV');
      }
      
      // Create a temporary competition (not saved to Firestore)
      const tempCompetition: Competition = {
        id: `temp-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        participants: parseResult.participants,
        status: 'active',
        userId: user?.uid || '',
      };
      
      setCompetitions(prev => [...prev, tempCompetition]);
      setSelectedCompetition(tempCompetition);
      
      if (parseResult.duplicates && parseResult.duplicates.length > 0) {
        setError(`Imported ${parseResult.participants.length} participants. ${parseResult.duplicates.length} duplicates were skipped.`);
      }
      
      // Reset file input
      e.target.value = '';
    } catch (err: any) {
      console.error('Error uploading CSV:', err);
      setError(err.message || 'Failed to upload CSV');
    } finally {
      setUploadingCsv(false);
    }
  };

  const handleCompetitionChange = async (competitionId: string) => {
    const comp = competitions.find(c => c.id === competitionId);
    if (comp) {
      // If it's a saved competition and we don't have full data, fetch it
      if (!comp.id?.startsWith('temp-') && (!comp.participants || comp.participants.length === 0)) {
        try {
          setLoading(true);
          const fullCompetition = await getCompetition(competitionId);
          if (fullCompetition) {
            setSelectedCompetition(fullCompetition);
            // Update in list too
            setCompetitions(prev => prev.map(c => c.id === competitionId ? fullCompetition : c));
          }
        } catch (err) {
          console.error('Error loading competition details:', err);
          setError('Failed to load competition details');
        } finally {
          setLoading(false);
        }
      } else {
        setSelectedCompetition(comp);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Get theme and settings from user settings or use defaults
  const spinnerSettings = userSettings?.spinner || {
    spinDuration: 'medium' as const,
    decelerationSpeed: 'medium' as const,
  };
  
  const spinnerTheme: SpinnerTheme = userSettings?.theme?.spinnerStyle || {
    nameColor: '#ffffff',
    ticketColor: '#a0a0a0',
    backgroundColor: '#1a1a1a',
    canvasBackground: '#0a0a0a',
    borderColor: '#333333',
    highlightColor: '#ffd700',
    nameSize: 'medium',
    ticketSize: 'small',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    topShadowOpacity: 0.8,
    bottomShadowOpacity: 0.8,
    shadowSize: 60,
    shadowColor: '#000000',
  };
  
  const branding = userSettings?.theme?.branding;
  
  // Determine which banner to show (competition specific or default)
  const bannerImage = selectedCompetition?.bannerImageId || branding?.bannerImage;

  return (
    <div className="min-h-screen bg-night text-white">
      {/* Branding Header */}
      {(bannerImage || branding?.logoImage) && (
        <div className="relative">
          {/* Banner */}
          {bannerImage && (
            <div className="w-full h-48 overflow-hidden">
              <img src={bannerImage} alt="Event Banner" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Logo and Company Name */}
          {branding?.logoImage && (
            <div
              className={`${
                bannerImage ? 'absolute inset-0' : 'relative py-8'
              } flex items-center px-4 ${
                branding.logoPosition === 'center'
                  ? 'justify-center'
                  : branding.logoPosition === 'right'
                    ? 'justify-end'
                    : 'justify-start'
              }`}
            >
              <div className="flex items-center gap-3 bg-night/70 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg border border-white/10">
                <img src={branding.logoImage} alt="Company Logo" className="h-16 w-auto" />
                {branding.showCompanyName && branding.companyName && (
                  <span className="text-2xl font-bold text-white">{branding.companyName}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Live Spinner</h1>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="text-gray-300 border-gray-600 hover:bg-gray-800"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Competition Selector and Upload */}
        <Card className="bg-night-light border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl">Select Competition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Select
                  value={selectedCompetition?.id || ''}
                  onValueChange={handleCompetitionChange}
                >
                  <SelectTrigger className="bg-night border-gray-700">
                    <SelectValue placeholder="Select a competition" />
                  </SelectTrigger>
                  <SelectContent className="bg-night-light border-gray-700">
                    {competitions.map((comp) => (
                      <SelectItem key={comp.id} value={comp.id || ''}>
                        {comp.name} ({comp.participants.length} participants)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-pink text-white rounded-md font-medium hover:from-neon-purple/90 hover:to-neon-pink/90 transition-all cursor-pointer">
                  <Upload className="h-4 w-4" />
                  {uploadingCsv ? 'Uploading...' : 'Upload CSV'}
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadingCsv}
                  />
                </label>
              </div>
              
              {selectedCompetition && (
                <div className="flex gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {selectedCompetition.participants.length} participants
                  </span>
                  {selectedCompetition.winners && selectedCompetition.winners.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      {selectedCompetition.winners.length} winners selected
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Spinner Area */}
        {selectedCompetition && selectedCompetition.participants && selectedCompetition.participants.length > 0 && (
          <>
            {/* Spinner Container */}
            <Card className="bg-night-light border-gray-800">
              <CardContent className="p-6">
                <div className="relative">
                  <SlotMachineWheel
                    participants={selectedCompetition.participants}
                    targetTicketNumber={ticketNumber}
                    settings={spinnerSettings}
                    isSpinning={isSpinning}
                    onSpinComplete={handleSpinComplete}
                    onError={(error) => {
                      setError(error);
                      setIsSpinning(false);
                    }}
                    theme={spinnerTheme}
                  />

                  {/* Winner Display Overlay */}
                  {currentWinner && (
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 z-10">
                      <Card className="bg-gradient-to-r from-yellow-500/95 to-yellow-600/90 border-yellow-400 shadow-2xl">
                        <CardContent className="p-8">
                          <div className="flex items-center gap-4">
                            <Sparkles className="h-12 w-12 text-gray-900 animate-pulse flex-shrink-0" />
                            <div className="flex-1 text-center">
                              <p className="text-4xl font-bold text-gray-900 leading-tight">
                                🎉 {currentWinner.firstName} {currentWinner.lastName}
                              </p>
                              <p className="text-2xl font-semibold text-gray-800 mt-2">
                                Ticket #{currentWinner.ticketNumber}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Spin Controls */}
            <Card className="bg-night-light border-gray-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Label className="text-sm text-gray-400">Enter Winning Ticket Number</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter ticket number"
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !isSpinning && handleSpin()}
                      disabled={isSpinning}
                      className="bg-night border-gray-700 text-white placeholder:text-gray-500"
                    />
                    <Button
                      onClick={handleSpin}
                      disabled={isSpinning || !ticketNumber}
                      size="lg"
                      className="min-w-[120px] bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/90 hover:to-neon-pink/90"
                    >
                      {isSpinning ? 'Spinning...' : 'Spin'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-900">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </>
        )}

        {/* Session Winners */}
        {sessionWinners.length > 0 && (
          <Card className="bg-night-light border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl">Session Winners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sessionWinners.slice(0, 5).map((winner, index) => (
                  <div
                    key={`${winner.ticketNumber}-${winner.timestamp}`}
                    className="flex justify-between items-center p-3 bg-night rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{index === 0 ? '🏆' : '🎉'}</span>
                      <div>
                        <p className="font-semibold">
                          {winner.firstName} {winner.lastName}
                        </p>
                        <p className="text-sm text-gray-400">Ticket #{winner.ticketNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{winner.competition}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(winner.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Competition Selected */}
        {!selectedCompetition && (
          <Card className="bg-night-light border-gray-800">
            <CardContent className="p-12 text-center">
              <p className="text-gray-400 mb-4">
                Select a competition from your dashboard or upload a CSV file to get started
              </p>
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/90 hover:to-neon-pink/90"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}