'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStoredUser, isAuthenticated, logout } from '@/lib/directus-auth';
import { getUserCompetitions, getUserStats, deleteCompetition, parseAndImportCSV, type Competition, type UserStats } from '@/lib/directus-competitions';
import {
  Download,
  Upload,
  Trophy,
  Users,
  Calendar,
  LogOut,
  Plus,
  FileText,
  Chrome,
  CheckCircle,
  Trash2,
  Eye,
  RefreshCw,
  Settings,
  User,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalCompetitions: 0,
    totalParticipants: 0,
    totalDraws: 0,
  });
  const [loading, setLoading] = useState(true);
  const [uploadingCsv, setUploadingCsv] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user data and competitions
  const loadData = async (userId: string) => {
    try {
      setRefreshing(true);
      setError(null);
      
      // Load competitions
      const userCompetitions = await getUserCompetitions();
      setCompetitions(userCompetitions);
      
      // Load stats
      const userStats = await getUserStats();
      setStats(userStats);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Check for token cookie first (magic link auth)
    const checkTokenAuth = () => {
      const cookies = document.cookie.split(';').map(c => c.trim());
      const tokenCookie = cookies.find(c => c.startsWith('token='));
      
      if (tokenCookie) {
        try {
          const token = tokenCookie.split('=')[1];
          // Decode JWT token to get email (basic base64 decode, not verification)
          const payload = token.split('.')[1];
          const decoded = JSON.parse(atob(payload));
          
          if (decoded && decoded.email && decoded.type === 'magic-link') {
            // User authenticated via magic link
            setUser({
              uid: `magic-${decoded.email}`, // Create a unique ID for magic link users
              email: decoded.email,
              displayName: decoded.email.split('@')[0], // Use email prefix as display name
            });
            
            // For magic link users, create mock data or limited functionality
            setStats({
              totalCompetitions: 0,
              totalParticipants: 0,
              totalDraws: 0,
            });
            setCompetitions([]);
            setLoading(false);
            return true; // Token auth found
          }
        } catch (e) {
          console.error('Error parsing token cookie:', e);
        }
      }
      return false; // No token found
    };

    // Check token auth first
    if (checkTokenAuth()) {
      return; // Token auth successful, no need for Firebase check
    }

    // Set a timeout to handle cases where Firebase doesn't respond
    const timeout = setTimeout(() => {
      console.error('Firebase auth check timeout - redirecting to login');
      setLoading(false);
      router.push('/login');
    }, 5000); // 5 second timeout

    // Check authentication state
    const checkAuth = async () => {
      clearTimeout(timeout); // Clear timeout if auth state is received
      
      const directusUser = getStoredUser();
      console.log('Dashboard - Retrieved stored user:', directusUser);
      console.log('Dashboard - Is authenticated:', isAuthenticated());

      if (directusUser && isAuthenticated()) {
        console.log('Dashboard - Setting user state:', {
          uid: directusUser.id,
          email: directusUser.email,
          displayName: directusUser.first_name || directusUser.email,
        });
        setUser({
          uid: directusUser.id,
          email: directusUser.email,
          displayName: directusUser.first_name || directusUser.email,
        });
        
        try {
          // Load user's competitions
          await loadData(directusUser.id);
        } catch (error) {
          console.error('Error loading user data:', error);
          setError('Failed to load data. Please refresh the page.');
        }
        setLoading(false);
      } else {
        // Not authenticated, redirect to login
        setLoading(false);
        router.push('/login');
      }
    };
    
    checkAuth().catch((error) => {
      // Handle auth errors
      clearTimeout(timeout);
      console.error('Auth check error:', error);
      setLoading(false);
      router.push('/login');
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    setUploadingCsv(true);
    setError(null);

    try {
      // Read file content
      const csvContent = await file.text();

      // Generate competition name from filename
      const competitionName = file.name.replace(/\.csv$/i, '') || 'Imported Competition';

      // Parse and import CSV (using default column mapping for now)
      const competition = await parseAndImportCSV(csvContent, competitionName, null);

      // Show success message
      if (competition && competition.participants) {
        const participantCount = competition.participants.length;
        console.log(`Successfully imported ${participantCount} participants`);
      }
      
      // Reload competitions to show the new one
      await loadData(user.uid);
      
      // Reset file input
      e.target.value = '';
    } catch (err: any) {
      console.error('Error uploading CSV:', err);
      setError(err.message || 'Failed to upload CSV. Please check the format and try again.');
    } finally {
      setUploadingCsv(false);
    }
  };

  const handleDeleteCompetition = async (competitionId: string) => {
    if (!window.confirm('Are you sure you want to delete this competition?')) {
      return;
    }

    try {
      setError(null);
      await deleteCompetition(competitionId);
      
      // Reload data
      if (user?.uid) {
        await loadData(user.uid);
      }
    } catch (err) {
      console.error('Error deleting competition:', err);
      setError('Failed to delete competition. Please try again.');
    }
  };

  const handleRefresh = () => {
    if (user?.uid && !refreshing) {
      loadData(user.uid);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    // Handle Firestore Timestamp
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    
    // Handle regular Date or string
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-night">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Account Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Welcome back, {user?.displayName || user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors ${
                refreshing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-900 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-night-light rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Competitions</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalCompetitions}</p>
              </div>
              <Trophy className="h-8 w-8 text-neon-purple" />
            </div>
          </div>

          <div className="bg-night-light rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Participants</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.totalParticipants.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-neon-pink" />
            </div>
          </div>

          <div className="bg-night-light rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Draws</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalDraws}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-night-light rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed Draws</p>
                <p className="text-2xl font-bold text-white mt-1">{competitions.filter(c => c.winners && c.winners.length > 0).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Account Overview */}
        <div className="bg-night-light rounded-lg border border-gray-800 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Display Name</p>
              <p className="text-white">{user?.displayName || 'Not set'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Account ID</p>
              <p className="text-white font-mono text-sm">{user?.uid}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Account Type</p>
              <p className="text-white">Premium</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-neon-purple to-neon-pink p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-2">Raffle Tools</h3>
            <p className="text-white/80 mb-4">
              Access your raffle spinner and configuration
            </p>
            <div className="flex gap-2">
              <Link
                href="/live-spinner/spinner"
                className="inline-flex items-center gap-2 bg-white text-night px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                <Trophy className="h-5 w-5" />
                Spinner
              </Link>
              <Link
                href="/live-spinner/options"
                className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-md font-medium hover:bg-white/30 transition-colors"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </div>
          </div>

          <div className="bg-night-light border border-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-2">Download Extension</h3>
            <p className="text-gray-400 mb-4">
              Get the Chrome Extension for offline use
            </p>
            <a
              href="/drawday-spinner-extension.zip"
              download
              className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-purple to-neon-pink text-white px-4 py-2 rounded-md font-medium hover:from-neon-purple/90 hover:to-neon-pink/90 transition-all"
            >
              <Chrome className="h-5 w-5" />
              Download Extension
            </a>
          </div>

          <div className="bg-night-light border border-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-2">Upload Participants</h3>
            <p className="text-gray-400 mb-4">Import participant list from CSV</p>
            <label className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-purple to-neon-pink text-white px-4 py-2 rounded-md font-medium hover:from-neon-purple/90 hover:to-neon-pink/90 transition-all cursor-pointer">
              <Upload className="h-5 w-5" />
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
        </div>

        {/* Competitions Table */}
        <div className="bg-night-light rounded-lg border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Competition Data</h2>
            <span className="text-sm text-gray-400">
              {competitions.length} competition{competitions.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-night border-b border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Competition Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {competitions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      No competitions yet. Upload a CSV to get started!
                    </td>
                  </tr>
                ) : (
                  competitions.map((competition) => (
                    <tr key={competition.id} className="hover:bg-night/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-white">{competition.name}</div>
                            {competition.winners && competition.winners.length > 0 && (
                              <div className="text-xs text-gray-400">
                                {competition.winners.length} winner
                                {competition.winners.length > 1 ? 's' : ''} selected
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {competition.participants.length.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            competition.status === 'active'
                              ? 'bg-green-900/50 text-green-400'
                              : competition.status === 'completed'
                                ? 'bg-blue-900/50 text-blue-400'
                                : 'bg-gray-900/50 text-gray-400'
                          }`}
                        >
                          {competition.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(competition.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-3">
                          <button 
                            className="text-neon-purple hover:text-neon-purple/80 font-medium"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => competition.id && handleDeleteCompetition(competition.id)}
                            className="text-red-400 hover:text-red-300"
                            title="Delete Competition"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CSV Format Guide */}
        <div className="mt-8 bg-night-light rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-2">CSV Format Guide</h3>
          <p className="text-gray-400 mb-4">
            Your CSV file should include the following columns:
          </p>
          <div className="bg-night rounded-md p-4 font-mono text-sm text-gray-300">
            <div className="mb-2">FirstName, LastName, TicketNumber, Email (optional)</div>
            <div className="text-gray-500">John, Doe, 12345, john@example.com</div>
            <div className="text-gray-500">Jane, Smith, 67890, jane@example.com</div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Note: The system will automatically detect column headers. Ensure ticket numbers are unique.
          </p>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-night-light rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
          <p className="text-gray-400 mb-4">
            Check out our guides to get started with DrawDay Spinner
          </p>
          <div className="flex gap-4">
            <Link
              href="/docs/getting-started"
              className="text-neon-purple hover:text-neon-purple/80 font-medium"
            >
              Getting Started Guide →
            </Link>
            <Link
              href="/support"
              className="text-neon-purple hover:text-neon-purple/80 font-medium"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}