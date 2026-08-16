# Clarity — Stuttering Therapy Web Application

A responsive web application for stuttering therapy. Practice daily exercises, track your progress, and build confidence in your speech journey.

![React](https://img.shields.io/badge/React-19-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8) ![Vite](https://img.shields.io/badge/Vite-7-646cff) ![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e)

## Features

- 📊 **Progress Tracking** — monitor improvement with detailed statistics and charts
- 🎯 **Daily Goals** — XP goals and streak counters to stay motivated
- 🏆 **Achievements** — unlock badges as you complete milestones
- 🎤 **Interactive Exercises** — guided speech exercises (Turtle Pace, Soft Sounds, Breathing, Word Repetition, Prolonged Sounds, Phrase Practice)
- 🤖 **AI-Generated Practice Content** — reading passages, Q&A prompts, and tongue twisters generated on demand
- 🗣️ **Stutter Detection** — audio analysis via an external ML model API (see [MODEL_API_README.md](./MODEL_API_README.md))
- 🔐 **Accounts & Auth** — sign up/sign in backed by Supabase
- 📈 **Data Visualization** — progress charts built with Recharts
- 🌐 **Responsive Design** — works on desktop, tablet, and mobile

## Tech Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 3
- **Backend:** Supabase (auth, database, Edge Functions)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Utilities:** clsx, tailwind-merge
- **AI:** OpenRouter (`anthropic/claude-3-haiku`), called through a Supabase Edge Function proxy so the API key never reaches the client
- **Testing/Demo:** Playwright (`demo*.mjs` screenshot scripts)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- A Supabase project (for auth/database and to host the AI proxy Edge Function)
- [Supabase CLI](https://supabase.com/docs/guides/cli) if you want to deploy/update the Edge Function

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abdu-l7hman/new_stuttering.git
   cd new_stuttering
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment template and fill in your Supabase project values:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:5173`

## Environment Variables

Set these in `.env` (see `.env.example`). **Never commit `.env`** — it's already gitignored.

| Variable | Where it's used | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | Client (`src/config/supabase.js`) | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Client (`src/config/supabase.js`) | Public anon key — safe to ship to the client as long as Row Level Security policies are configured correctly |

The OpenRouter API key is **not** a client env var. It's set as a Supabase secret for the Edge Function that proxies AI requests:

```bash
supabase secrets set OPENROUTER_API_KEY=your-openrouter-api-key
supabase functions deploy openrouter-proxy
```

## Available Scripts

- `npm run dev` — start the development server
- `npm run build` — build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Project Structure

```
clarity-web/
├── src/
│   ├── components/         # Landing, Onboarding, Login/Register, Dashboard,
│   │                       # Assessment, Statistics, Learning, Settings, Navbar, etc.
│   ├── config/
│   │   └── supabase.js     # Supabase client + auth helpers
│   ├── context/
│   │   └── SettingsContext.jsx
│   ├── hooks/
│   │   └── useProgress.js
│   ├── utils/
│   │   └── aiGenerate.js   # Calls the openrouter-proxy Edge Function
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase/
│   └── functions/
│       └── openrouter-proxy/  # Edge Function that proxies OpenRouter requests
├── public/                 # Static assets
├── demo*.mjs                # Playwright scripts for screenshots/demos
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── .env.example
└── package.json
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) → "New Project" → import your repo
3. Configure build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Vercel project settings
5. Deploy

### Deploy the AI proxy

The `openrouter-proxy` Edge Function is deployed separately through Supabase, not through Vercel:

```bash
supabase functions deploy openrouter-proxy
```

## Features Walkthrough

### Dashboard
- Daily XP goals and current streak
- Practice exercises in a responsive grid
- Overall progress percentage

### Practice Exercises
- Turtle Pace — slow down your speech
- Soft Sounds — practice gentle onset
- Breathing Exercise — control your breath
- Word Repetition — practice challenging words
- Prolonged Sounds — stretch vowel sounds
- Phrase Practice — build fluent phrases

### AI-Generated Content
- Reading passages, conversational Q&A prompts, and tongue twisters generated per session via the `openrouter-proxy` Edge Function

### Statistics
- Weekly stuttering severity chart
- Total sessions, XP, and streak counters
- Achievement badges and milestones

### Assessment
- Multi-step speech assessment wizard
- Recording simulation with visualizer
- Progress tracking across steps

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ for the stuttering therapy community
