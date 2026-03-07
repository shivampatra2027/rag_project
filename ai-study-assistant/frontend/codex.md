Refactor and polish the UI/UX of my React + Tailwind + Shadcn AI Study Assistant to production-grade quality.

Stack:
- React
- TailwindCSS
- shadcn/ui
- lucide-react icons
- axios
- dark theme

The application has pages:
Home
Upload
Chat
Quiz
Revision
Prediction

GOAL:
Make the UI feel like a modern AI SaaS product similar to ChatGPT, Perplexity, or Notion AI.

Do NOT change backend logic or API calls. Only improve UI/UX.

------------------------------------------------

GLOBAL DESIGN SYSTEM

Create a consistent design system.

Use:

rounded-2xl
soft shadows
glassmorphism
smooth animations
clean spacing

Add a gradient background:

bg-gradient-to-br
from-[#020617]
via-[#0f172a]
to-[#020617]

Typography:

text-zinc-100
text-zinc-400 secondary text
font-semibold titles

Use max content width:

max-w-6xl
mx-auto

------------------------------------------------

NAVBAR IMPROVEMENT

Improve top navbar.

Features:

• sticky navbar
• glass effect
• active page indicator
• hover animations

Example styles:

backdrop-blur-xl
bg-white/5
border-b border-white/10

Active tab:

bg-primary
text-white
rounded-xl
px-4 py-2

------------------------------------------------

CHAT PAGE (MOST IMPORTANT)

Upgrade chat UI to modern AI style.

Features to implement:

1. Modern chat bubbles

User bubble:

bg-gradient-to-br
from-cyan-500
to-blue-600
text-white
rounded-2xl
shadow-lg

AI bubble:

bg-zinc-900
border border-zinc-800
text-zinc-200
rounded-2xl
backdrop-blur

Limit message width:

max-w-[70%]

2. Markdown rendering

Install:

npm install react-markdown remark-gfm

Render AI responses with markdown.

3. Smooth message animation

animate-[fadeIn_.3s_ease]

Add animation:

@keyframes fadeIn {
  from {
    opacity:0;
    transform:translateY(8px);
  }
  to {
    opacity:1;
    transform:translateY(0);
  }
}

4. Typing indicator animation

3 animated dots when AI is responding.

5. Scrollable chat area

Use:

overflow-y-auto
h-[70vh]

6. Chat input upgrade

Modern AI input box:

rounded-2xl
border border-zinc-800
bg-zinc-900/80
backdrop-blur-xl
p-2

Send button:

rounded-xl
bg-primary
hover:scale-105
transition

7. Message actions (on hover)

Add icons:

Copy
Regenerate

------------------------------------------------

UPLOAD PAGE

Improve file upload UI.

Add:

• drag and drop zone
• animated upload progress
• file preview
• success indicator

Drop zone style:

border-dashed
border-2
border-zinc-700
rounded-2xl
p-10
text-center

Hover state:

border-primary

------------------------------------------------

QUIZ PAGE

Improve quiz UI.

Features:

• question cards
• answer selection animation
• progress bar
• next button animation

Card style:

bg-zinc-900
border border-zinc-800
rounded-2xl
shadow-lg

Answer option:

hover:bg-zinc-800
cursor-pointer
transition

------------------------------------------------

REVISION PAGE

Improve study plan display.

Use cards for each day.

Example:

Day Card

bg-zinc-900
rounded-2xl
p-6
border border-zinc-800

Inside card:

Title
Topics
Checklist

Add progress indicator.

------------------------------------------------

MICRO INTERACTIONS

Add subtle animations:

hover:scale-[1.02]
transition-all duration-200

Buttons:

hover:-translate-y-0.5

Cards:

shadow-lg
hover:shadow-xl

------------------------------------------------

EMPTY STATES

Improve empty states with icons.

Example:

No notes uploaded
Upload a PDF to start learning.

Centered layout with icon.

------------------------------------------------

LOADING STATES

Add skeleton loaders.

Example:

animate-pulse
bg-zinc-800
rounded

------------------------------------------------

RESPONSIVE DESIGN

Ensure mobile support.

Use:

flex-col
sm:flex-row

Limit width:

max-w-6xl

------------------------------------------------

EXPECTED RESULT

A polished AI SaaS interface with:

• modern AI chat UI
• markdown formatted responses
• smooth animations
• glassmorphism design
• consistent layout
• responsive pages
• professional look

The UI should feel similar to ChatGPT or Perplexity.