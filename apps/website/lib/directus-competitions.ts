// Directus Competitions Service
import { getStoredToken, refreshToken } from './directus-auth';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://db.drawday.app';

export interface Competition {
  id: string;
  name: string;
  participants: Array<{
    firstName: string;
    lastName: string;
    ticketNumber: string;
  }>;
  winners?: Array<{
    participant: any;
    timestamp: number;
  }>;
  createdAt?: string;
  userId?: string;
  status?: string;
  bannerImageId?: string;
}

export interface UserStats {
  totalCompetitions: number;
  totalParticipants: number;
  totalDraws: number;
}

async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
  let token = getStoredToken();

  if (!token) {
    throw new Error('No authentication token');
  }

  // Try the request with current token
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  // If token expired, try to refresh and retry
  if (response.status === 401) {
    token = await refreshToken();
    if (token) {
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  }

  return response;
}

export async function getUserCompetitions(): Promise<Competition[]> {
  const response = await makeAuthenticatedRequest(`${DIRECTUS_URL}/items/competitions?filter[status][_eq]=active`);

  if (!response.ok) {
    throw new Error('Failed to fetch competitions');
  }

  const { data } = await response.json();

  return data.map((comp: any) => ({
    id: comp.id,
    name: comp.name,
    participants: comp.participants_data ? JSON.parse(comp.participants_data) : [],
    winners: comp.winners_data ? JSON.parse(comp.winners_data) : [],
    createdAt: comp.created_at,
    userId: comp.user_id,
    status: comp.status,
    bannerImageId: comp.banner_image_id,
  }));
}

export async function getCompetition(id: string): Promise<Competition> {
  const response = await makeAuthenticatedRequest(`${DIRECTUS_URL}/items/competitions/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch competition');
  }

  const { data: comp } = await response.json();

  return {
    id: comp.id,
    name: comp.name,
    participants: comp.participants_data ? JSON.parse(comp.participants_data) : [],
    winners: comp.winners_data ? JSON.parse(comp.winners_data) : [],
    createdAt: comp.created_at,
    userId: comp.user_id,
    status: comp.status,
    bannerImageId: comp.banner_image_id,
  };
}

export async function createCompetition(competition: Omit<Competition, 'id'>): Promise<Competition> {
  const competitionData = {
    name: competition.name,
    participants_data: JSON.stringify(competition.participants),
    winners_data: competition.winners ? JSON.stringify(competition.winners) : null,
    status: 'active',
    created_at: new Date().toISOString(),
  };

  const response = await makeAuthenticatedRequest(`${DIRECTUS_URL}/items/competitions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(competitionData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Failed to create competition');
  }

  const { data } = await response.json();
  return await getCompetition(data.id);
}

export async function updateCompetition(id: string, updates: Partial<Competition>): Promise<Competition> {
  const updateData: any = {};

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.participants !== undefined) updateData.participants_data = JSON.stringify(updates.participants);
  if (updates.winners !== undefined) updateData.winners_data = JSON.stringify(updates.winners);
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.bannerImageId !== undefined) updateData.banner_image_id = updates.bannerImageId;

  const response = await makeAuthenticatedRequest(`${DIRECTUS_URL}/items/competitions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Failed to update competition');
  }

  return await getCompetition(id);
}

export async function deleteCompetition(id: string): Promise<void> {
  const response = await makeAuthenticatedRequest(`${DIRECTUS_URL}/items/competitions/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete competition');
  }
}

export async function getUserStats(): Promise<UserStats> {
  const competitions = await getUserCompetitions();

  const totalParticipants = competitions.reduce((sum, comp) => sum + comp.participants.length, 0);
  const totalDraws = competitions.reduce((sum, comp) => sum + (comp.winners?.length || 0), 0);

  return {
    totalCompetitions: competitions.length,
    totalParticipants,
    totalDraws,
  };
}

// Helper function for CSV import
export async function parseAndImportCSV(csvContent: string, competitionName: string, columnMapping: any) {
  // This would use the CSV parser to parse the content and create a competition
  // For now, return a simple implementation
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');

  const participants = lines.slice(1).map((line, index) => {
    const values = line.split(',');
    return {
      firstName: values[columnMapping.firstName] || '',
      lastName: values[columnMapping.lastName] || '',
      ticketNumber: values[columnMapping.ticketNumber] || `${index + 1}`,
    };
  }).filter(p => p.firstName || p.lastName);

  return await createCompetition({
    name: competitionName,
    participants,
    winners: [],
  });
}