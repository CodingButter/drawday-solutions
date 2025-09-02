import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  addDoc 
} from 'firebase/firestore';
import { db } from './firebase';
import { CSVParser, IntelligentColumnMapper } from '@raffle-spinner/csv-parser';
import { ColumnMapping } from '@raffle-spinner/storage';
import type { SavedMapping } from '@raffle-spinner/types';

export interface Participant {
  firstName: string;
  lastName: string;
  ticketNumber: string;
  email?: string;
  phone?: string;
}

export interface Winner {
  participant: Participant;
  timestamp: number;
  position: number;
}

export interface Competition {
  id?: string;
  name: string;
  description?: string;
  participants: Participant[];
  winners?: Winner[];
  status: 'draft' | 'active' | 'completed';
  userId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  drawDate?: Date;
  participantCount: number;
  winnersCount?: number;
  bannerImage?: string; // Legacy: Base64 encoded image (for backward compatibility)
  bannerImageId?: string; // New: Reference to image stored in IndexedDB
}

export interface UserStats {
  totalCompetitions: number;
  totalParticipants: number;
  activeDraws: number;
  completedDraws: number;
}

// User Settings for persistent storage
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  winner: string;
  winnerGlow: string;
}

export interface SpinnerStyle {
  type: 'slotMachine' | 'wheel' | 'cards';
  backgroundColor: string;
  nameColor: string;
  ticketColor: string;
  borderColor: string;
  highlightColor: string;
  nameSize: string;
  ticketSize: string;
  fontFamily?: string;
  canvasBackground?: string;
  topShadowOpacity?: number;
  bottomShadowOpacity?: number;
  shadowSize?: number;
  shadowColor?: string;
}

export interface BrandingConfig {
  logoImage?: string; // Base64 encoded
  logoPosition: 'left' | 'center' | 'right';
  bannerImage?: string; // Base64 encoded
  companyName?: string;
  showCompanyName: boolean;
}

export interface UserSettings {
  userId: string;
  theme: {
    colors: ThemeColors;
    spinnerStyle: SpinnerStyle;
    branding: BrandingConfig;
  };
  csvColumnMappings?: SavedMapping[];
  lastUpdated: Timestamp;
  createdAt?: Timestamp;
}

// Competition CRUD operations
export const createCompetition = async (competition: Omit<Competition, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    // Clean up the competition data to remove undefined values
    const competitionData: any = {
      name: competition.name,
      participants: competition.participants,
      participantCount: competition.participantCount,
      status: competition.status,
      userId: competition.userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    // Only add optional fields if they exist
    if (competition.description) competitionData.description = competition.description;
    if (competition.winners) competitionData.winners = competition.winners;
    if (competition.winnersCount) competitionData.winnersCount = competition.winnersCount;
    if (competition.drawDate) competitionData.drawDate = competition.drawDate;
    
    const docRef = await addDoc(collection(db, 'competitions'), competitionData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating competition:', error);
    throw error;
  }
};

export const updateCompetition = async (id: string, updates: Partial<Competition>): Promise<void> => {
  try {
    const competitionRef = doc(db, 'competitions', id);
    await updateDoc(competitionRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating competition:', error);
    throw error;
  }
};

export const getCompetition = async (id: string): Promise<Competition | null> => {
  try {
    const competitionRef = doc(db, 'competitions', id);
    const competitionSnap = await getDoc(competitionRef);
    
    if (competitionSnap.exists()) {
      return {
        id: competitionSnap.id,
        ...competitionSnap.data()
      } as Competition;
    }
    return null;
  } catch (error) {
    console.error('Error getting competition:', error);
    throw error;
  }
};

export const getUserCompetitions = async (userId: string): Promise<Competition[]> => {
  try {
    const competitionsRef = collection(db, 'competitions');
    
    // Try with orderBy first
    try {
      const q = query(
        competitionsRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const competitions: Competition[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        competitions.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toMillis?.() || Date.now(),
          updatedAt: data.updatedAt?.toMillis?.() || Date.now()
        } as Competition);
      });
      
      return competitions;
    } catch (indexError: any) {
      // If the index doesn't exist, try without orderBy
      console.log('Index not available, falling back to simple query');
      
      const q = query(
        competitionsRef, 
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const competitions: Competition[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        competitions.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toMillis?.() || Date.now(),
          updatedAt: data.updatedAt?.toMillis?.() || Date.now()
        } as Competition);
      });
      
      // Sort in memory if we couldn't use orderBy
      competitions.sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return bTime - aTime;
      });
      
      return competitions;
    }
  } catch (error) {
    console.error('Error getting user competitions:', error);
    // Return empty array instead of throwing to handle initial state
    return [];
  }
};

export const deleteCompetition = async (id: string): Promise<void> => {
  try {
    const competitionRef = doc(db, 'competitions', id);
    await deleteDoc(competitionRef);
  } catch (error) {
    console.error('Error deleting competition:', error);
    throw error;
  }
};

// Add winners to a competition
export const addWinners = async (competitionId: string, winners: Winner[]): Promise<void> => {
  try {
    const competitionRef = doc(db, 'competitions', competitionId);
    await updateDoc(competitionRef, {
      winners,
      winnersCount: winners.length,
      status: 'completed',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding winners:', error);
    throw error;
  }
};

// Import participants from CSV data
export const importParticipants = async (
  competitionName: string,
  participants: Participant[],
  userId: string
): Promise<string> => {
  try {
    const competition: Omit<Competition, 'id' | 'createdAt' | 'updatedAt'> = {
      name: competitionName,
      participants,
      participantCount: participants.length,
      status: 'draft',
      userId,
    };
    
    return await createCompetition(competition);
  } catch (error) {
    console.error('Error importing participants:', error);
    throw error;
  }
};

// User Settings CRUD operations
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const settingsRef = doc(db, 'userSettings', userId);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      const data = settingsSnap.data() as UserSettings;
      console.log('Retrieved user settings from Firebase:', data);
      return data;
    }
    
    // If no settings exist, create default settings
    const defaultSettings: UserSettings = {
      userId,
      theme: {
        colors: {
          primary: '#007BFF',
          secondary: '#FF1493',
          accent: '#FFD700',
          background: '#09090b',
          foreground: '#fafafa',
          card: '#09090b',
          cardForeground: '#fafafa',
          winner: '#FFD700',
          winnerGlow: '#FFD700',
        },
        spinnerStyle: {
          type: 'slotMachine',
          backgroundColor: '#1a1a1a',
          nameColor: '#ffffff',
          ticketColor: '#ffffff',
          borderColor: '#333333',
          highlightColor: '#FFD700',
          nameSize: 'large',
          ticketSize: 'medium',
          fontFamily: 'system-ui',
          canvasBackground: '#09090b',
          topShadowOpacity: 0.3,
          bottomShadowOpacity: 0.3,
          shadowSize: 30,
        },
        branding: {
          logoPosition: 'center',
          showCompanyName: false,
        },
      },
      lastUpdated: serverTimestamp() as Timestamp,
      createdAt: serverTimestamp() as Timestamp,
    };
    
    await setDoc(settingsRef, defaultSettings);
    return defaultSettings;
  } catch (error) {
    console.error('Error getting user settings:', error);
    throw error;
  }
};

// Helper to clean data for Firebase (remove undefined, functions, etc)
const cleanForFirebase = (obj: any, path: string = ''): any => {
  // Handle primitives and null
  if (obj === null) return null;
  if (obj === undefined) {
    console.log(`Removing undefined at path: ${path}`);
    return null;
  }
  
  // Handle special types
  if (obj instanceof Date) return obj;
  if (obj instanceof Timestamp) return obj;
  
  // Handle serverTimestamp
  if (typeof obj === 'function') {
    console.log(`Removing function at path: ${path}`);
    return null;
  }
  
  // Handle primitives
  if (typeof obj !== 'object') {
    // Check for NaN or Infinity
    if (typeof obj === 'number' && (!isFinite(obj) || isNaN(obj))) {
      console.log(`Removing invalid number at path: ${path}`);
      return null;
    }
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item, index) => cleanForFirebase(item, `${path}[${index}]`))
              .filter(item => item !== undefined);
  }
  
  // Handle objects
  const cleaned: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const cleanedValue = cleanForFirebase(value, path ? `${path}.${key}` : key);
      
      // Only include if not undefined
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    }
  }
  
  return cleaned;
};

export const updateUserSettings = async (
  userId: string, 
  updates: Partial<UserSettings>
): Promise<void> => {
  try {
    const settingsRef = doc(db, 'userSettings', userId);
    
    console.log('Raw updates before cleaning:', JSON.stringify(updates, null, 2));
    
    // Clean the data to remove any invalid values for Firebase
    const cleanedUpdates = cleanForFirebase(updates);
    
    console.log('Cleaned updates:', JSON.stringify(cleanedUpdates, null, 2));
    
    // Final data to save
    const dataToSave = {
      ...cleanedUpdates,
      userId, // Ensure userId is always set
      lastUpdated: serverTimestamp(),
    };
    
    console.log('Final data structure (without serverTimestamp):', 
      JSON.stringify({...dataToSave, lastUpdated: 'serverTimestamp()'}, null, 2));
    
    // Use setDoc with merge to handle both creation and update
    await setDoc(settingsRef, dataToSave, { merge: true });
    
    console.log('Successfully saved to Firebase');
  } catch (error) {
    console.error('Error updating user settings:', error);
    console.error('Failed data:', updates);
    throw error;
  }
};

export const updateThemeColors = async (
  userId: string,
  colors: Partial<ThemeColors>
): Promise<void> => {
  try {
    const settings = await getUserSettings(userId);
    if (!settings) return;
    
    await updateUserSettings(userId, {
      theme: {
        ...settings.theme,
        colors: {
          ...settings.theme.colors,
          ...colors,
        },
      },
    });
  } catch (error) {
    console.error('Error updating theme colors:', error);
    throw error;
  }
};

export const updateSpinnerStyle = async (
  userId: string,
  style: Partial<SpinnerStyle>
): Promise<void> => {
  try {
    const settings = await getUserSettings(userId);
    if (!settings) return;
    
    await updateUserSettings(userId, {
      theme: {
        ...settings.theme,
        spinnerStyle: {
          ...settings.theme.spinnerStyle,
          ...style,
        },
      },
    });
  } catch (error) {
    console.error('Error updating spinner style:', error);
    throw error;
  }
};

export const updateBranding = async (
  userId: string,
  branding: Partial<BrandingConfig>
): Promise<void> => {
  try {
    console.log('updateBranding called with userId:', userId, 'branding:', branding);
    
    const settings = await getUserSettings(userId);
    if (!settings) {
      console.error('No settings found for user:', userId);
      return;
    }
    
    const updatedTheme = {
      ...settings.theme,
      branding: {
        ...settings.theme.branding,
        ...branding,
      },
    };
    
    console.log('Updating settings with theme:', updatedTheme);
    
    await updateUserSettings(userId, {
      theme: updatedTheme,
    });
    
    console.log('Branding updated successfully in Firebase');
  } catch (error) {
    console.error('Error updating branding:', error);
    throw error;
  }
};

export const saveColumnMapping = async (
  userId: string,
  mapping: SavedMapping
): Promise<void> => {
  try {
    const settings = await getUserSettings(userId);
    if (!settings) return;
    
    const mappings = settings.csvColumnMappings || [];
    const existingIndex = mappings.findIndex(m => m.id === mapping.id);
    
    if (existingIndex >= 0) {
      mappings[existingIndex] = mapping;
    } else {
      mappings.push(mapping);
    }
    
    await updateUserSettings(userId, {
      csvColumnMappings: mappings,
    });
  } catch (error) {
    console.error('Error saving column mapping:', error);
    throw error;
  }
};

// Utility function to convert File to base64
export const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Get just the timestamp for efficient polling
export const getUserSettingsTimestamp = async (userId: string): Promise<number | null> => {
  try {
    const settingsRef = doc(db, 'userSettings', userId);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      const data = settingsSnap.data();
      return data.lastUpdated?.toMillis?.() || null;
    }
    return null;
  } catch (error: any) {
    // Silently handle permission errors for non-existent documents
    if (error?.code !== 'permission-denied' && error?.message && !error.message.includes('Missing or insufficient permissions')) {
      console.error('Error getting settings timestamp:', error);
    }
    return null;
  }
};

// Get user statistics
export const getUserStats = async (userId: string): Promise<UserStats> => {
  try {
    const competitions = await getUserCompetitions(userId);
    
    const stats: UserStats = {
      totalCompetitions: competitions.length,
      totalParticipants: competitions.reduce((sum, c) => sum + (c.participantCount || 0), 0),
      activeDraws: competitions.filter(c => c.status === 'active').length,
      completedDraws: competitions.filter(c => c.status === 'completed').length,
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting user stats:', error);
    // Return default stats instead of throwing
    return {
      totalCompetitions: 0,
      totalParticipants: 0,
      activeDraws: 0,
      completedDraws: 0,
    };
  }
};

// Parse CSV file and create competition
export const parseAndImportCSV = async (
  file: File,
  userId: string
): Promise<{ competitionId: string; participantCount: number; duplicates?: any[] }> => {
  try {
    // Use the shared CSV parser from the extension
    const parser = new CSVParser();
    const detector = new IntelligentColumnMapper();
    
    // First, read the file to detect columns
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file must have a header row and at least one data row');
    }
    
    // Detect columns from the CSV header
    const headers = lines[0].split(',').map(h => h.trim());
    const columnMapping = detector.detectHeaders(headers);
    
    // Validate that we have the required columns
    if (!columnMapping.ticketNumber || (!columnMapping.fullName && (!columnMapping.firstName || !columnMapping.lastName))) {
      throw new Error('Could not detect required columns in CSV. Please ensure your CSV has columns for name (or first/last name) and ticket number.');
    }
    
    // Parse the CSV using the shared parser
    const parseResult = await parser.parse(file, columnMapping);
    
    if (parseResult.participants.length === 0) {
      throw new Error('No valid participants found in CSV');
    }
    
    // Create competition name from file name
    const competitionName = file.name.replace(/\.[^/.]+$/, '');
    
    // Import to Firestore
    const competitionId = await importParticipants(
      competitionName, 
      parseResult.participants, 
      userId
    );
    
    return { 
      competitionId, 
      participantCount: parseResult.participants.length,
      duplicates: parseResult.duplicates
    };
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw error;
  }
};