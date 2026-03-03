---

## TASK 8 — Production UI Upgrade (shadcn/ui)

Goal:
Upgrade frontend UI to production-quality using shadcn/ui components.

Requirements:

------------------------------------------------

1. Install TailwindCSS (Vite setup)

Configure Tailwind for React Vite project.

Add:
- tailwindcss
- postcss
- autoprefixer

Create:
tailwind.config.js
postcss.config.js

Enable Tailwind in index.css.

------------------------------------------------

2. Install shadcn/ui

Initialize shadcn:

npx shadcn-ui@latest init

Configuration:
- React
- Tailwind
- Default theme
- CSS variables enabled

------------------------------------------------

3. Install Components

Add:

button
card
input
textarea
scroll-area
navbar (navigation menu)
separator
badge
spinner (loader equivalent)

------------------------------------------------

4. Layout Upgrade

Create:

src/components/Layout.jsx

Use shadcn Card + container layout.

App layout:

Navbar (top)
Main container (centered)
Active page content

------------------------------------------------

5. Navbar Upgrade

Create modern navbar using shadcn components:

- sticky top
- app title left
- navigation buttons right
- highlight active route

------------------------------------------------

6. Update Pages Using shadcn

Replace existing HTML elements with:

Upload.jsx:
- Card
- Button
- Input

Chat.jsx:
- ScrollArea for messages
- message bubbles styled with Tailwind
- fixed input bar

Quiz.jsx:
- Card per question
- Badge for answers

Revision.jsx:
- Card per day plan

Prediction.jsx:
- Card sections
- Badge importance score

------------------------------------------------

7. Loading States

Use spinner component while API requests run.

------------------------------------------------

8. Styling Rules

- Clean SaaS dashboard look
- soft gray background
- max width container
- responsive layout
- spacing using Tailwind utilities

------------------------------------------------

Constraints:

- Do NOT change API logic
- Only UI refactor
- Reuse existing state logic
- Must run immediately

Rules:
- Modify only required files
- Return only modified files
- No explanations