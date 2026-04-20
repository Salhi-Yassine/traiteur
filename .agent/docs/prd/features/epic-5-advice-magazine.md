# Epic 5: Advice & Magazine (The "Farah Magazine")

## 1. Overview
The Farah Magazine is the content engine of the platform, designed to provide couples with professional wedding planning advice, cultural insights, and inspiration. Inspired by **The Knot (Content)** and **Airbnb (UI/UX)**, this section bridges the gap between pure inspiration and actionable vendor discovery.

## 2. User Stories

### US-5.1: Browse Planning Articles
> As Nadia, I want to browse categorized wedding planning articles so that I can learn how to organize my Moroccan wedding step-by-step.

**Acceptance Criteria:**
- [ ] Magazine landing page (`/magazine`) features a "Featured" hero article.
- [ ] Articles are organized by categories (Planning 101, Tradition, Fashion, Beauty, Honeymoon).
- [ ] Horizontal scrollable category bar (Airbnb-style) for quick filtering.
- [ ] Lazy-loaded grid of article cards showing: thumbnail, category, title, excerpt, and reading time.

### US-5.2: Read Interactive Advice
> As Nadia, I want an immersive reading experience so that I can focus on the advice without distractions.

**Acceptance Criteria:**
- [ ] Immersive hero header with high-quality imagery.
- [ ] Clean typography using DM Serif Display for headers and Plus Jakarta Sans for body text.
- [ ] Smooth parallax or fade-in effects on scroll (inspired by Airbnb "Online Experiences").
- [ ] "Table of Contents" sticky sidebar for long articles.

### US-5.3: Integrated Marketplace
> As Nadia, I want to see relevant vendors while reading advice so that I can immediately act on the tips I'm reading.

**Acceptance Criteria:**
- [ ] Article sidebar or footer shows "Recommended Vendors" based on the article's tags.
- [ ] "Shop this Look" widget within articles for fashion/decor content.
- [ ] Direct links from articles to pre-filtered vendor directory sections.

## 3. UI/UX Specifications (Airbnb Style)

### Layout Patterns
- **The Category Bar**: A sticky horizontal scroll bar with minimalist icons/text for each article category.
- **The Floating Action Card**: In the article detail view, a floating card that suggests the "Next Step" or a "Featured Vendor".
- **Whitespace First**: Emphasis on macro-whitespace to make Moroccan-patterned ornaments pop.

### Components
- `MagazineHero`: Full-width image with integrated search/headline.
- `ArticleCard`: Minimalist card with `shadow-1` and `hover:shadow-2`.
- `CategoryPill`: Standardized pill component for the category bar.

## 4. Technical Requirements

### Data Model (Leveraging existing `Article` entity)
- **Entities**: `Article`, `ArticleCategory`.
- **Fields**: Title, Slug, Content, Excerpt, FeaturedImage, Author, PublishedAt, Tags, isFeatured.
- **Localization**: Full support for fr/ar/ary/en via Gedmo Translatable.

### API Endpoints
- `GET /api/articles`: Collection with filters for category and tags.
- `GET /api/articles/{slug}`: Single article retrieval.
- `GET /api/article_categories`: List of categories for the navigation bar.

## 5. Success Metrics
- **Average Time on Page**: > 4 minutes per article.
- **CTR to Vendor Profiles**: > 10% from magazine articles.
- **SEO Organic Reach**: Performance against keywords like "Mariage Marocain", "Négafa conseils", etc.
