# Ambedkar Atlas: Project Specification & Architecture

**Tagline:** A digital heritage archive for Dr. B. R. Ambedkar  
**Repository:** `Ambedkar Atlas`  
**Stack:** React 19 / Vite / TypeScript / Tailwind CSS / React Router / Lucide React / Framer Motion

---

## 1. Project Overview & Vision
Ambedkar Atlas is a premium, production-quality, frontend-only digital heritage archive commemorating the life, scholarly works, speeches, manuscripts, and constitutional legacy of Dr. Bhimrao Ramji Ambedkar (1891–1956). 

The interface evokes a **curated digital museum**: warm, archival, respectful, accessible, and deeply engaging. It balances historical gravity with contemporary responsive UI design.

---

## 2. Visual Identity & Design System

### 2.1 Color Palette
- **Antique Ivory (`#F5EBDD`)**: Primary application background, warm museum wall tone.
- **Museum White (`#FBF8F2`)**: Elevated cards, transcription reader surface, clean contrast.
- **Aged Parchment (`#E7D5B9`)**: Secondary surfaces, timeline cards, metadata pills.
- **Archival Ink (`#29251F`)**: Primary typography, high-contrast headings, linework.
- **Body Text (`#51483F`)**: Editorial prose, secondary typography, legibility optimized.
- **Burnt Terracotta (`#B96535`)**: Primary accent, active states, key interactive buttons.
- **Dark Walnut (`#713F2B`)**: Deep accent, hover states, strong focal points.
- **Border / Rule (`#DED3C2`)**: Delicate borders, dividers, archival framing.
- **Muted Text (`#827567`)**: Dates, metadata tags, auxiliary info.
- **Gold Foil / Seal (`#C89B3C`)**: Verification seals, landmark achievements.

### 2.2 Typography
- **Headings & Editorial Serifs:** `Cormorant Garamond`, serif (class: `font-serif`)
- **Body & Interface:** `Inter` / system-ui, sans-serif (class: `font-sans`)
- **Document / Transcription:** `Newsreader` / `Cormorant Garamond` with generous line-height (`leading-relaxed`)

### 2.3 Textures & Styling
- Subtle SVG paper noise overlay on page backgrounds (`bg-paper-grain`).
- Archival framing borders: double-rule headers, deckle-edge hints, and warm sepia duotone filters.
- Subtle motion: smooth Framer Motion transitions, layered parallax hero.

---

## 3. Global Multi-Device Experience & Previewer
The application includes a global **Device Preview Bar** allowing evaluators to preview the experience in 4 dedicated modes:
1. **Desktop (Full Editorial)**: Multi-column layouts, rich sidebars, horizontal timeline option, full reading split-view.
2. **Mobile (Portrait Touch)**: Handheld layout, bottom/drawer navigation, touch targets >= 44px, stacked viewer.
3. **Touchscreen Kiosk (`/kiosk`)**: 1080p touch layout, massive category tiles, high-contrast buttons, voice/narration toggle, simulated inactivity timer reset.
4. **Smart TV (10-Foot Experience)**: Landscape remote-first layout, oversized typography, high-contrast D-pad focus rings, keyboard arrow + Enter navigation.

---

## 4. Routes & Core Modules

### 4.1 `/` — Home (Cinematic Heritage Hero)
- **Hero Scene**: Over-the-shoulder historical viewpoint. Foreground: Dr. B. R. Ambedkar transparent silhouette. Midground: Stylized archival crowd (e.g. Mahad or Constituent Assembly). Background: Architectural & parchment depth.
- Parallax mouse drift and gentle ambient motion (respecting `prefers-reduced-motion`).
- Skip intro / continue behavior.
- Direct search bar & "Explore the Archive" CTA.
- **Heritage Categories**: Writings, Speeches, Manuscripts, Photographs, Audio & Video.
- **Journey Through Time**: Compact chronological preview with direct link to `/timeline`.
- **From the Archives**: Curated featured items with quick preview.
- **Ask & Discover**: AI Assistant teaser with clickable prompt pills leading into `/research`.
- **Preservation & Provenance**: Principles of digital archiving and access.

### 4.2 `/archive` — Browse & Discovery
- Fast client-side search across titles, descriptions, transcriptions, tags.
- Multi-faceted filters: Category, Historical Period, Language, Media Type.
- Display Toggle: Editorial Grid vs. Archival Catalog List view.
- Sorting: Relevance, Date (Newest/Oldest), Title A-Z.
- Active filter chips, clear-all, pagination/load more.
- Loading skeletons and graceful empty states with suggested alternative searches.

### 4.3 `/archive/:id` — Document & Media Viewer
- Multi-tab inspection:
  - **Original**: High-resolution facsimile document view with zoom in/out, fit-to-page, pan.
  - **Transcription**: Clean, legible, bookmarked prose reader with font-size controls.
  - **Summary**: Key arguments, historical context, and impact.
  - **Translation**: Original language (e.g., Marathi/English) side-by-side or toggled.
- **Simulated Narration Player**: Audio waveform/scrubber, play/pause, speed controls (1x, 1.25x, 1.5x), chapter markers.
- **Archival Metadata & Citations**: Citation generator (APA, Chicago, MLA, BibTeX) with 1-click copy.
- **Bookmarks**: Saved to `localStorage` with active indicators.
- **Related Records**: Contextually linked documents.

### 4.4 `/timeline` — Historical Chronology (1891–1956)
- Spans critical epochs:
  1. 1891–1912: Early Life & Baroda Sponsorship
  2. 1913–1923: Columbia University, London School of Economics & Gray's Inn
  3. 1924–1935: Bahishkrit Hitakarini Sabha, Mahad Satyagraha, Kalaram Temple & Poona Pact
  4. 1936–1946: Annihilation of Caste, Independent Labour Party & Viceroy's Executive Council
  5. 1947–1951: Law Minister, Drafting the Constitution of India & Hindu Code Bill
  6. 1952–1956: Rajya Sabha, Buddhist Conversion (Deekshabhoomi) & Mahaparinirvana
- Dual layout: Desktop horizontal interactive scrubber track; Mobile vertical timeline.
- Event slide-over detail drawer with archival photos, quotes, and "View related archival records" linking to `/archive`.

### 4.5 `/research` — Simulated Citation-Backed AI Assistant
- Conversational research console modeled after modern citation-backed RAG engines.
- Pre-populated recommended research questions:
  - *"What were Dr. Ambedkar's principal arguments in Annihilation of Caste?"*
  - *"How did Dr. Ambedkar approach the drafting of Fundamental Rights?"*
  - *"Explain the historical context and outcomes of the 1927 Mahad Satyagraha."*
  - *"What was the Poona Pact of 1932 and Dr. Ambedkar's perspective?"*
- Asynchronous simulation: typing animation, query decomposition, document retrieval badges.
- Generated response includes inline citations `[1]`, `[2]` linking directly to archive document IDs.
- Source cards at the bottom of each answer with direct links to `/archive/:id`.
- Copy response, copy bibliography, clear history, suggested follow-ups.

### 4.6 `/about` — Editorial & Preservation
- Archival mission, digitization standards, open-access principles, accessibility compliance, and disclaimer on simulated prototype capabilities.

### 4.7 `/kiosk` — Dedicated Touch-First Kiosk Experience
- Full-screen high-impact interface with large tap cards, fast touch categories, virtual voice narration simulation, quick search, and simulated timeout countdown.

### 4.8 `/search` — Dedicated Search Results
- Global search view with keyword highlighting, filtered matches, recent query history.

---

## 5. Mock Data Architecture (`src/data/`)
- `archiveRecords.ts`: ~20-30 richly detailed archival records with full transcripts, metadata, citations, media types, categories, and tags.
- `timelineEvents.ts`: Landmark events with dates, eras, descriptions, quotes, and linked record IDs.
- `researchResponses.ts`: Knowledge base of simulated RAG queries, structured markdown answers, citations, and follow-ups.
- `categories.ts`: Archival collections definitions.

## 6. Local Storage Persistence
- User Bookmarks (`ambedkar_atlas_bookmarks`)
- Recent Searches (`ambedkar_atlas_recent_searches`)
- Selected Device Mode (`ambedkar_atlas_device_mode`)
- Accessibility Preferences (`font-size`, `reduced-motion`)

---

## 7. Quality & Verification Standards
- Fully type-safe (TypeScript strictly checked).
- Accessible navigation, WCAG AA color contrast, keyboard navigable.
- Fully working simulated async delays (200-400ms) with clean skeletons.
- Zero broken images or dead buttons.
