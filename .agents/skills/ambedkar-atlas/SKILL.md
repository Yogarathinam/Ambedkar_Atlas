---
name: ambedkar-atlas
description: Complete knowledge base and implementation guide for the Ambedkar Atlas digital heritage archive application.
---

# Ambedkar Atlas Archive Knowledge Base

This skill provides key architectural guidelines, domain knowledge, design system tokens, and route structures for the **Ambedkar Atlas** project.

## Core Visual Palette
- Background (Antique Ivory): `#F5EBDD`
- Reading Surface (Museum White): `#FBF8F2`
- Secondary Surface (Aged Parchment): `#E7D5B9`
- Primary Ink (Archival Ink): `#29251F`
- Body Text: `#51483F`
- Terracotta Accent: `#B96535`
- Walnut Deep Accent: `#713F2B`
- Framing Border: `#DED3C2`
- Muted Metadata: `#827567`
- Gold Seal: `#C89B3C`

## Key User Journeys
1. **Hero & Discovery (`/`)**: Layered cinematic historical hero with Dr. Ambedkar silhouette + crowd parallax, search entry, categories, timeline teaser, featured records, research assistant teaser.
2. **Archive Explorer (`/archive`)**: Category filters, era filters, language, search, grid/list view, sort, chips, pagination.
3. **Document Viewer (`/archive/:id`)**: Facsimile preview with zoom/fit, transcription, summary, translation tabs, audio narration player, citations (APA/MLA/Chicago), bookmarking.
4. **Interactive Timeline (`/timeline`)**: 1891–1956 historical epochs, desktop horizontal scroll / mobile vertical view, event details slide-out drawer, linked archive records.
5. **Simulated AI Research Assistant (`/research`)**: RAG simulation with sample queries, inline citations `[1]`, source cards linked to documents, copy actions.
6. **Device Preview Switcher**: Desktop, Mobile, Touch Kiosk (`/kiosk`), Smart TV with keyboard/remote navigation.
7. **Global Search (`/search`)**: Real-time query, filterable results, search history.
8. **About Page (`/about`)**: Editorial mission, preservation standards, prototype disclaimer.
