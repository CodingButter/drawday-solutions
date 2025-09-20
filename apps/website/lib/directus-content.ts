/**
 * Directus Content Service
 * Handles all content fetching from Directus CMS
 */

import {
  GlobalSettings,
  HomePage,
  AboutPage,
  Statistics,
  Service,
  PortfolioItem,
  TeamMember,
  LegalPage,
  Company,
  Competition,
  DirectusResponse,
  DirectusListResponse,
  CalculatedStats,
} from '@/types/directus';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://db.drawday.app';
const DIRECTUS_PROJECT = 'drawday';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

// Cache duration in seconds
const CACHE_DURATION = 60; // 1 minute for ISR

// Generic fetch function with error handling
async function fetchFromDirectus<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  try {
    const url = `${DIRECTUS_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        ...options.headers,
      },
      next: {
        revalidate: CACHE_DURATION,
      },
    });

    if (!response.ok) {
      console.error(`Directus fetch error: ${response.status} for ${endpoint}`);
      // Return empty array or null for missing collections to allow graceful fallback
      return null;
    }

    const data = await response.json();
    return data.data as T;
  } catch (error) {
    console.error(`Failed to fetch from Directus: ${endpoint}`, error);
    return null;
  }
}

// Singleton Fetchers

export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  return fetchFromDirectus<GlobalSettings>('/items/global_settings');
}

export async function getHomePage(): Promise<HomePage | null> {
  return fetchFromDirectus<HomePage>('/items/home_page');
}

export async function getAboutPage(): Promise<AboutPage | null> {
  return fetchFromDirectus<AboutPage>('/items/about_page');
}

export async function getStatisticsSettings(): Promise<Statistics | null> {
  return fetchFromDirectus<Statistics>('/items/statistics');
}

// Collection Fetchers

export async function getServices(status: 'active' | 'all' = 'active'): Promise<Service[]> {
  const filter = status === 'active' ? '?filter[status][_eq]=active&sort=order' : '?sort=order';
  const response = await fetchFromDirectus<Service[]>(`/items/services${filter}`);
  return response || [];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const response = await fetchFromDirectus<Service[]>(
    `/items/services?filter[slug][_eq]=${slug}&limit=1`
  );
  return response && response.length > 0 ? response[0] : null;
}

export async function getPortfolioItems(featured?: boolean): Promise<PortfolioItem[]> {
  let filter = '?filter[status][_eq]=published&sort=-project_date';
  if (featured) {
    filter += '&filter[is_featured][_eq]=true';
  }
  const response = await fetchFromDirectus<PortfolioItem[]>(`/items/portfolio_items${filter}`);
  return response || [];
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const response = await fetchFromDirectus<TeamMember[]>(
    '/items/team_members?filter[is_active][_eq]=true&sort=display_order'
  );
  return response || [];
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  const response = await fetchFromDirectus<LegalPage[]>(
    `/items/legal_pages?filter[slug][_eq]=${slug}&filter[status][_eq]=published&limit=1`
  );
  return response && response.length > 0 ? response[0] : null;
}

export async function getActiveCompanies(): Promise<Company[]> {
  const response = await fetchFromDirectus<Company[]>(
    '/items/companies?filter[is_active][_eq]=true&sort=display_order'
  );
  return response || [];
}

export async function getClientCompanies(): Promise<Company[]> {
  const response = await fetchFromDirectus<Company[]>(
    '/items/companies?filter[show_as_client][_eq]=true&sort=display_order'
  );
  return response || [];
}

// Statistics Calculations

export async function getCalculatedStatistics(): Promise<CalculatedStats> {
  try {
    // Get statistics settings for overrides
    const statsSettings = await getStatisticsSettings();

    // Get companies for count
    const companies = await fetchFromDirectus<Company[]>(
      '/items/companies?filter[is_active][_eq]=true'
    );

    // Get competitions for prize count
    const competitions = await fetchFromDirectus<Competition[]>(
      '/items/competitions?filter[status][_eq]=completed'
    );

    // Calculate statistics
    const companiesServed = statsSettings?.companies_served_override || companies?.length || 0;

    // Sum up all winner_count from competitions
    const prizesDrawn =
      statsSettings?.prizes_drawn_override ||
      competitions?.reduce((sum, comp) => sum + (comp.winner_count || 0), 0) ||
      0;

    const totalCompetitions = competitions?.length || 0;

    // Calculate monthly active companies (competitions in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCompetitions =
      competitions?.filter((comp) => new Date(comp.draw_date) > thirtyDaysAgo) || [];

    const uniqueCompanies = new Set(recentCompetitions.map((comp) => comp.company_id));
    const monthlyActiveCompanies = uniqueCompanies.size;

    return {
      companiesServed,
      prizesDrawn,
      totalCompetitions,
      monthlyActiveCompanies,
    };
  } catch (error) {
    console.error('Failed to calculate statistics:', error);
    return {
      companiesServed: 0,
      prizesDrawn: 0,
      totalCompetitions: 0,
      monthlyActiveCompanies: 0,
    };
  }
}

// Contact Form Submission

export async function submitContactForm(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  service_interest?: string;
}) {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        status: 'new',
        created_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit contact form');
    }

    return await response.json();
  } catch (error) {
    console.error('Contact form submission error:', error);
    throw error;
  }
}

// Helper function to get image URL from Directus file
export function getDirectusImageUrl(
  fileId: string,
  options?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'inside' | 'outside';
    quality?: number;
  }
): string {
  let url = `${DIRECTUS_URL}/assets/${fileId}`;

  const params = new URLSearchParams();
  if (options?.width) params.append('width', options.width.toString());
  if (options?.height) params.append('height', options.height.toString());
  if (options?.fit) params.append('fit', options.fit);
  if (options?.quality) params.append('quality', options.quality.toString());

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return url;
}
