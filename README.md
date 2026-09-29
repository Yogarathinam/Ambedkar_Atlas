# Ambedkar Atlas — Digital Heritage Archive

> **"Educate • Agitate • Organize"**  
> *A digital heritage archive for Dr. B. R. Ambedkar (1891–1956)*

Ambedkar Atlas is a premium, production-quality, frontend-only React application designed as an editorial digital museum archive. It commemorates the life, writings, speeches, manuscripts, and constitutional legacy of **Dr. Bhimrao Ramji Ambedkar**, India's first Law Minister and Chairman of the Constitution Drafting Committee.

---

## 🏛️ Visual Identity & Palette

Crafted with an archival museum aesthetic using warm aged parchment tones and high-contrast typography:

- **Antique Ivory (`#F5EBDD`)**: Primary application background with subtle paper grain texture.
- **Museum White (`#FBF8F2`)**: Cards and reading surfaces.
- **Aged Parchment (`#E7D5B9`)**: Secondary surfaces, timeline cards, metadata chips.
- **Archival Ink (`#29251F`)**: Headings and primary typography.
- **Body Text (`#51483F`)**: Editorial prose and descriptive paragraphs.
- **Burnt Terracotta (`#B96535`)**: Primary accent and interactive callouts.
- **Dark Walnut (`#713F2B`)**: Deep accent and hover states.
- **Border / Rule (`#DED3C2`)**: Delicate archival framing dividers.
- **Muted Text (`#827567`)**: Dates, accession numbers, and citations.

**Typography:**
- **Editorial Headings:** `Cormorant Garamond` (Google Fonts)
- **Interface & Body:** `Inter`
- **Archival Transcription Reader:** `Newsreader` / Serif

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Development
```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle with TypeScript validation
npm run build

# Preview production build locally
npm run preview
```

The application will be live at `http://127.0.0.1:5173/`.

---

## 🗺️ Public Routes & Features

| Route | View Name | Description |
|---|---|---|
| `/` | **Home** | Over-the-shoulder cinematic parallax hero, category entry cards, compact timeline preview, featured master archives, AI assistant preview, preservation charter. |
| `/archive` | **Explore Archive** | Multi-faceted catalog browser with search, category filters (Writings, Speeches, Manuscripts, Photos, Audio, Video, Records), era filters, language filters, grid/list toggle, sorting, and bookmarks filter. |
| `/archive/:id` | **Document Viewer** | Inspection deck with segmented tabs: *Transcription* (with text size controls), *Original Facsimile* (with zoom +/-, fit, pan), *Historical Summary*, and *Translation*. Includes audio narration player and citation generator (APA, Chicago, MLA, BibTeX). |
| `/timeline` | **Interactive Timeline** | Chronological journey (1891–1956) with horizontal scrubber track on desktop, vertical view on mobile/kiosk, era filters, and event detail modal linked to catalog records. |
| `/research` | **AI Assistant (RAG)** | Simulated citation-backed research console with pre-populated prompts, asynchronous thinking state, structured answers, and interactive `[1]` citation markers linking to primary sources. |
| `/kiosk` | **Touchscreen Kiosk** | High-contrast touch exhibition mode with large tap cards, quick search, simulated language selector (English, Marathi, Hindi), voice narration toggle, and session auto-reset countdown. |
| `/search` | **Catalog Search** | Global search with query history persistence in `localStorage`, result counts, and quick jump to faceted catalog. |
| `/about` | **About & Preservation** | Editorial mission, primary source provenance (BAWS Vols 1–17), digitisation methodology, and prototype disclosure. |

---

## 📱 Multi-Device Preview Modes

A dedicated **Prototype Device Preview Bar** is pinned at the top of the interface:
1. **Desktop Mode:** Full multi-column editorial museum experience with horizontal timeline track and sidebar filter drawer.
2. **Mobile Mode:** Formatted in an interactive smartphone frame (viewport width 390px) demonstrating portrait touch navigation, touch targets >= 44px, and zero horizontal overflow.
3. **Touch Kiosk Mode (`/kiosk`):** Full-screen touch interface with giant category tiles, voice guide simulation toggle, and auto-reset inactivity timer.
4. **Smart TV Mode:** 10-foot remote experience with large typography (20px+), high-contrast borders, and keyboard arrow key focus indicators.

---

## 🖼️ Hero Asset Customization

The cinematic hero features an over-the-shoulder perspective with Dr. Ambedkar in the foreground and a stylized historical crowd in the background:
- Default vector illustrations (`ambedkar-silhouette.svg`, `historical-crowd.svg`, `parchment-backdrop.svg`) are bundled in `src/assets/hero/` to guarantee zero broken assets out of the box.
- To substitute authentic custom PNG cutouts, simply save:
  - `src/assets/hero/ambedkar-portrait.png`
  - `src/assets/hero/historical-crowd.png`
- These are managed centrally in `src/assets/hero/heroAssets.ts`.

---

## 💾 Architecture & Mock Layer

- **`src/types/index.ts`:** Full TypeScript contracts for `ArchiveRecord`, `TimelineEvent`, `ResearchQA`, `FilterState`, and `DeviceMode`.
- **`src/data/`:** Centralized mock datasets with 18+ comprehensive historical records, 12 landmark timeline events, and curated RAG knowledge bases.
- **`src/services/archiveService.ts`:** Promise-based asynchronous service layer with simulated 180–750ms latency to model real-world API loading and error handling.
- **Local Storage:** Safely persists bookmarks (`ambedkar_atlas_bookmarks`), recent searches (`ambedkar_atlas_recent_searches`), and device preview preferences.

---

## 📜 Curatorial Provenance
All historical excerpts, speeches, and treatise summaries are compiled from:
- *Dr. Babasaheb Ambedkar: Writings and Speeches (BAWS)*, Volumes 1–17, Government of Maharashtra.
- *Constituent Assembly Debates (CAD)*, Parliament of India.
- *National Archives of India*, Home Political Department Records.
- *London School of Economics (LSE)* Archives.
