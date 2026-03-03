---

## TASK 7 — App Navigation + UI Polish

Goal:
Convert pages into a proper app layout with navigation and cleaner UI.

Requirements:

1. Create component:

src/components/Navbar.jsx

Navbar contains buttons:

- Home
- Upload
- Chat
- Quiz
- Revision
- Prediction

2. Navigation System:

Implement simple client-side navigation using React state
OR React Router (allowed).

Each button opens corresponding page:

Home → Home.jsx  
Upload → Upload.jsx  
Chat → Chat.jsx  
Quiz → Quiz.jsx  
Revision → Revision.jsx  
Prediction → Prediction.jsx

3. Layout:

App.jsx should:

- Render Navbar at top
- Render active page below navbar
- Maintain currentPage state

4. UI Improvements:

- Center main content
- Add spacing between sections
- Add basic button styling
- Consistent font sizing
- Scrollable content area

(No UI libraries.)

5. UX Improvements:

- Highlight active page button
- Prevent full page reloads
- Keep layout responsive

6. Constraints:

- Minimal CSS only
- Do not redesign existing logic
- Reuse existing pages
- Must run immediately

Rules:
- Modify only required files
- Do not regenerate project
- Return only modified files
- No explanations