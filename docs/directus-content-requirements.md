# Directus Content Management Requirements

## Executive Summary

This document outlines the required Directus singleton collections and fields needed to make the DrawDay Solutions website production-ready. All static content, marketing copy, and metrics will be managed through Directus CMS to enable easy content updates without code deployments.

## Current Issues to Address

### Dummy Data to Remove/Replace

1. **"50+ Raffle Companies Served"** - Currently hardcoded
2. **"£10M+ Prizes Drawn"** - Currently shows value but should show count of prizes
3. **"100K+ Live Viewers"** - Should be removed (not trackable)
4. **Client company names** - Currently placeholder text
5. **Contact information** - Placeholder phone and address

### Missing Pages (Referenced but Not Created)

- Portfolio page (`/portfolio`)
- About page (`/about`)
- Contact page (`/contact`)
- Streaming page (`/streaming`)
- Websites page (`/websites`)
- Careers page (`/careers`)
- Privacy Policy page (`/privacy`)
- Terms of Service page (`/terms`)
- Cookie Policy page (`/cookies`)

## Required Directus Collections

### 1. Global Settings (Singleton)

**Collection Name:** `global_settings`

#### Fields:

- `site_name` (String) - Default: "DrawDay Solutions"
- `site_tagline` (String) - Default: "Technology Partner for UK Raffle Companies"
- `site_description` (Text) - SEO meta description
- `contact_email` (Email) - Primary contact email
- `contact_phone` (String) - Primary phone number
- `office_address` (Text) - Physical office address
- `office_city` (String) - Office city
- `office_country` (String) - Office country
- `social_github` (URL) - GitHub profile URL
- `social_twitter` (URL) - Twitter/X profile URL
- `social_linkedin` (URL) - LinkedIn company URL
- `copyright_text` (String) - Footer copyright text

### 2. Home Page Content (Singleton)

**Collection Name:** `home_page`

#### Hero Section:

- `hero_badge_text` (String) - Badge text above title
- `hero_title` (String) - Main headline
- `hero_subtitle` (Text) - Subtitle/description
- `hero_cta_primary_text` (String) - Primary button text
- `hero_cta_primary_link` (String) - Primary button link
- `hero_cta_secondary_text` (String) - Secondary button text
- `hero_cta_secondary_link` (String) - Secondary button link or action

#### Services Section:

- `services_title` (String) - Section title
- `services_subtitle` (Text) - Section subtitle

#### Why Choose DrawDay Section:

- `why_choose_title` (String) - Section title
- `why_choose_items` (JSON) - Array of reasons with icon, title, description

#### Client Logos Section:

- `clients_title` (String) - Section title
- `show_client_logos` (Boolean) - Toggle client section visibility

#### CTA Section:

- `cta_title` (String) - Call to action title
- `cta_subtitle` (Text) - Call to action subtitle
- `cta_button_primary_text` (String) - Primary CTA button text
- `cta_button_secondary_text` (String) - Secondary CTA button text

### 3. Services (Collection)

**Collection Name:** `services`

#### Fields:

- `id` (UUID) - Primary key
- `name` (String) - Service name
- `slug` (String) - URL slug
- `short_description` (Text) - Card description
- `icon` (String) - Icon identifier (lucide icon name)
- `color_scheme` (String) - Color theme (purple, blue, green)
- `features` (JSON) - Array of feature strings
- `status` (String) - active, coming_soon, beta
- `order` (Integer) - Display order
- `full_description` (Rich Text) - Full service page content
- `pricing_info` (Text) - Pricing details
- `demo_available` (Boolean) - Show demo button

### 4. Portfolio Items (Collection)

**Collection Name:** `portfolio_items`

#### Fields:

- `id` (UUID) - Primary key
- `company_name` (String) - Client company name
- `project_title` (String) - Project name
- `description` (Rich Text) - Project description
- `services_provided` (M2M relation to services) - Services delivered
- `results_metrics` (JSON) - Key results/metrics
- `testimonial_text` (Text) - Client testimonial
- `testimonial_author` (String) - Testimonial author name
- `testimonial_role` (String) - Author's role
- `featured_image` (File) - Main project image
- `gallery_images` (Files) - Additional images
- `case_study_url` (URL) - Link to full case study
- `project_date` (Date) - Project completion date
- `is_featured` (Boolean) - Show on homepage
- `display_order` (Integer) - Sort order
- `status` (String) - published, draft

### 5. About Page Content (Singleton)

**Collection Name:** `about_page`

#### Fields:

- `hero_title` (String) - Page title
- `hero_subtitle` (Text) - Page subtitle
- `mission_title` (String) - Mission section title
- `mission_content` (Rich Text) - Mission statement
- `vision_title` (String) - Vision section title
- `vision_content` (Rich Text) - Vision statement
- `values` (JSON) - Array of company values with title and description
- `history_timeline` (JSON) - Company milestones/timeline

### 6. Team Members (Collection)

**Collection Name:** `team_members`

#### Fields:

- `id` (UUID) - Primary key
- `name` (String) - Full name
- `role` (String) - Job title
- `bio` (Text) - Short biography
- `photo` (File) - Profile photo
- `linkedin_url` (URL) - LinkedIn profile
- `display_order` (Integer) - Sort order
- `is_active` (Boolean) - Show on website

### 7. Statistics (Singleton)

**Collection Name:** `statistics`

#### Fields:

- `show_statistics` (Boolean) - Toggle statistics display
- `companies_served_override` (Integer) - Manual override for company count
- `prizes_drawn_override` (Integer) - Manual override for number of prizes drawn
- `update_frequency` (String) - How often to update (daily, weekly, monthly)
- `last_updated` (Timestamp) - Last manual update

### 8. Legal Pages (Collection)

**Collection Name:** `legal_pages`

#### Fields:

- `id` (UUID) - Primary key
- `title` (String) - Page title
- `slug` (String) - URL slug (privacy, terms, cookies)
- `content` (Rich Text) - Page content
- `last_updated` (Date) - Last revision date
- `version` (String) - Version number
- `status` (String) - published, draft

### 9. Contact Form Submissions (Collection)

**Collection Name:** `contact_submissions`

#### Fields:

- `id` (UUID) - Primary key
- `name` (String) - Submitter name
- `email` (Email) - Submitter email
- `company` (String) - Company name (optional)
- `phone` (String) - Phone number (optional)
- `subject` (String) - Message subject
- `message` (Text) - Message content
- `service_interest` (String) - Service they're interested in
- `status` (String) - new, contacted, resolved
- `notes` (Text) - Internal notes
- `created_at` (Timestamp) - Submission date

### 10. Competitions Data (Collection)

**Collection Name:** `competitions`
_For calculating real statistics_

#### Fields:

- `id` (UUID) - Primary key
- `company_id` (M2O relation to companies) - Company running the competition
- `name` (String) - Competition name
- `prize_value` (Decimal) - Prize monetary value
- `winner_count` (Integer) - Number of winners
- `participant_count` (Integer) - Number of participants
- `draw_date` (DateTime) - When the draw occurred
- `status` (String) - scheduled, completed, cancelled

### 11. Companies (Collection)

**Collection Name:** `companies`
_For tracking actual client companies_

#### Fields:

- `id` (UUID) - Primary key
- `name` (String) - Company name
- `logo` (File) - Company logo
- `website` (URL) - Company website
- `is_active` (Boolean) - Active client
- `joined_date` (Date) - When they became a client
- `show_as_client` (Boolean) - Display in client section
- `display_order` (Integer) - Sort order

## Calculated Metrics

### Automatic Calculations from Data:

1. **Companies Served**: Count of active companies in `companies` collection
2. **Prizes Drawn**: Total count of all draws/winners from completed competitions (sum of `winner_count` from all competitions)
3. **Total Prize Value**: Sum of `prize_value` from completed competitions (for internal metrics, not displayed)
4. **Total Competitions**: Count of completed competitions
5. **Monthly Active Companies**: Companies with competitions in last 30 days

### Metrics to Remove:

- **Live Viewers**: Cannot be accurately tracked, should be removed from homepage

## Implementation Notes

### Phase 1: Core Content (Priority)

1. Create `global_settings` singleton
2. Create `home_page` singleton
3. Create `services` collection with initial data
4. Create `legal_pages` collection with privacy, terms, cookies

### Phase 2: Dynamic Content

1. Create `companies` collection
2. Create `competitions` collection
3. Create `statistics` singleton with calculation logic
4. Set up automated statistics updates

### Phase 3: Extended Content

1. Create `portfolio_items` collection
2. Create `about_page` singleton
3. Create `team_members` collection
4. Create `contact_submissions` collection

## API Endpoints Required

### Public Endpoints (No Auth):

- `GET /items/global_settings` - Fetch global settings
- `GET /items/home_page` - Fetch homepage content
- `GET /items/services?filter[status][_eq]=active` - Fetch active services
- `GET /items/portfolio_items?filter[status][_eq]=published` - Fetch portfolio
- `GET /items/legal_pages/:slug` - Fetch legal page by slug
- `GET /items/statistics` - Fetch statistics
- `POST /items/contact_submissions` - Submit contact form

### Authenticated Endpoints:

- `GET /items/companies` - Fetch companies (for statistics)
- `GET /items/competitions` - Fetch competitions (for statistics)

## Content Migration Strategy

1. **Create Collections**: Set up all singleton and regular collections in Directus
2. **Seed Initial Data**: Populate with current website content as starting point
3. **Replace Hardcoded Content**: Update React components to fetch from Directus
4. **Add Caching**: Implement Redis or similar for API response caching
5. **Set Up Webhooks**: Trigger site rebuilds on content changes

## Security Considerations

1. **API Permissions**: Configure proper read/write permissions per collection
2. **Rate Limiting**: Implement rate limiting on public endpoints
3. **Input Validation**: Validate all form submissions server-side
4. **CORS Configuration**: Properly configure CORS for production domain
5. **API Keys**: Use environment-specific API keys

## Performance Optimizations

1. **Static Generation**: Pre-render pages with content at build time
2. **ISR (Incremental Static Regeneration)**: Revalidate content every 60 seconds
3. **CDN Caching**: Cache API responses at CDN level
4. **Image Optimization**: Use Directus image transformations
5. **Query Optimization**: Fetch only required fields

## Maintenance Considerations

1. **Content Versioning**: Enable Directus revisions for content rollback
2. **Backup Strategy**: Regular automated backups of Directus database
3. **Change Logs**: Track all content changes with user attribution
4. **Preview Environment**: Set up staging environment for content preview
5. **Content Approval Workflow**: Implement review process for critical content

## Next Steps

1. Review and approve this document
2. Create Directus collections based on these specifications
3. Develop API integration service for Next.js
4. Create content management documentation for editors
5. Train content team on Directus usage
6. Implement monitoring and analytics

## Estimated Timeline

- **Week 1**: Create collections and initial content migration
- **Week 2**: Implement API integration and replace hardcoded content
- **Week 3**: Testing, optimization, and content team training
- **Week 4**: Production deployment and monitoring setup

---

_Document Version: 1.0_
_Last Updated: 2025-09-20_
_Author: DrawDay Solutions Development Team_
