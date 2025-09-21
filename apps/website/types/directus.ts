/**
 * Directus Content Types
 * Based on the collections defined in directus-content-requirements.md
 */

// Singleton Collections

export interface GlobalSettings {
  id?: number;
  site_name: string;
  site_tagline: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  office_address: string;
  office_city: string;
  office_country: string;
  social_github?: string;
  social_twitter?: string;
  social_linkedin?: string;
  copyright_text: string;
}

export interface HomePage {
  id?: number;
  // Hero Section
  hero_badge_text: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_primary_text: string;
  hero_cta_primary_link: string;
  hero_cta_secondary_text: string;
  hero_cta_secondary_link: string;

  // Services Section
  services_title: string;
  services_subtitle: string;

  // Why Choose Section
  why_choose_title: string;
  why_choose_items: WhyChooseItem[];

  // Client Logos Section
  clients_title: string;
  show_client_logos: boolean;

  // CTA Section
  cta_title: string;
  cta_subtitle: string;
  cta_button_primary_text: string;
  cta_button_secondary_text: string;
}

export interface WhyChooseItem {
  icon: string;
  title: string;
  description: string;
}

export interface AboutPage {
  id?: number;
  hero_title: string;
  hero_subtitle: string;
  mission_title: string;
  mission_content: string;
  vision_title: string;
  vision_content: string;
  values: CompanyValue[];
  history_timeline: TimelineItem[];
}

export interface CompanyValue {
  title: string;
  description: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface Statistics {
  id?: number;
  show_statistics: boolean;
  companies_served_override?: number;
  prizes_drawn_override?: number;
  update_frequency: 'daily' | 'weekly' | 'monthly';
  last_updated: string;
}

// Regular Collections

export interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  icon: string;
  color_scheme: 'purple' | 'blue' | 'green';
  features: string[];
  status: 'active' | 'coming_soon' | 'beta';
  order: number;
  full_description?: string;
  pricing_info?: string;
  demo_available: boolean;
}

export interface PortfolioItem {
  id: string;
  company_name: string;
  project_title: string;
  description: string;
  services_provided: Service[];
  results_metrics: ResultMetric[];
  testimonial_text?: string;
  testimonial_author?: string;
  testimonial_role?: string;
  featured_image?: DirectusFile;
  gallery_images?: DirectusFile[];
  case_study_url?: string;
  project_date: string;
  is_featured: boolean;
  display_order: number;
  status: 'published' | 'draft';
}

export interface ResultMetric {
  label: string;
  value: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo?: DirectusFile;
  linkedin_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface LegalPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  last_updated: string;
  version: string;
  status: 'published' | 'draft';
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  service_interest?: string;
  status: 'new' | 'contacted' | 'resolved';
  notes?: string;
  created_at: string;
}

export interface Competition {
  id: string;
  company_id: string;
  name: string;
  prize_value: number;
  winner_count: number;
  participant_count: number;
  draw_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Company {
  id: string;
  name: string;
  logo?: DirectusFile;
  website?: string;
  is_active: boolean;
  joined_date: string;
  show_as_client: boolean;
  display_order: number;
}

export interface DirectusFile {
  id: string;
  filename_disk: string;
  filename_download: string;
  title?: string;
  type: string;
  uploaded_on: string;
}

// API Response Types

export interface DirectusResponse<T> {
  data: T;
}

export interface DirectusListResponse<T> {
  data: T[];
  meta?: {
    filter_count: number;
    total_count: number;
  };
}

// Calculated Statistics
export interface CalculatedStats {
  companiesServed: number;
  prizesDrawn: number;
  totalCompetitions: number;
  monthlyActiveCompanies: number;
}
