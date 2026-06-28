---
name: Quizzer architecture
description: Key decisions for the Quizzer quiz platform — data bundling, state, routing, admin
---

The Quizzer app (artifacts/quizzer) is fully client-side with no backend requirement.

**Data bundling:** NASSCOM questions (10 modules, 318 total questions) were parsed from the two uploaded Excel files using SheetJS and saved as `src/data/nasscomData.json`. This JSON is bundled at build time. Admin panel allows overriding with a new uploaded Excel workbook; overrides are stored in localStorage (`quizzer_custom_bank`).

**Why:** Avoids needing a database or API server for the quiz feature. Simpler deployment, works offline.

**State:** Zustand stores — `quizStore` (active quiz session), `adminStore` (auth), `categoryStore` (category/module list). All quiz state is in-memory; results are not persisted between sessions.

**Routing:** Wouter (not react-router-dom — despite user request, the monorepo frontend_general_rules require wouter). Route pattern: `/category/:categoryId/module/:moduleId/setup` → `/quiz` → `/result`.

**Answer remapping:** When shuffling option order, the correct answer letter is remapped to its new position in the shuffled array. e.g., if "b) CHATGPT" was the answer and "b" ends up at position 0 after shuffle, the correct answer becomes "a".

**Excel parsing:** Correct answer column contains values like "b) CHATGPT", "a, c" (multi-answer). Parser extracts the letter(s). Multi-answer questions set `isMultiAnswer: true` and `correctAnswer: string[]`.

**Admin credentials:** Default admin/admin123, stored in localStorage (`quizzer_admin_creds`). Configurable via admin panel (not implemented in UI yet — stored but no settings form built).

**How to apply:** When adding new categories, add a new entry in `loadCategories()` in `services/questionBank.ts` following the same Category shape.
