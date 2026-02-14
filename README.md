# 📝 Note That Down

**Plan your day, drop it in the group chat.**

A mobile-first web app for creating beautiful, shareable day plans. Built with React + Supabase.

**Live at [note-that-down.com](https://note-that-down.com)**

---

## Quick Start

```bash
# Install dependencies
npm install

# Copy env template and fill in your Supabase keys
cp .env.example .env

# Run the Supabase migration
npx supabase db push

# Start dev server
npm run dev
```

---

## Project Structure

```
note-that-down/
├── src/
│   ├── main.jsx              # Entry point + React Router
│   ├── App.jsx               # Creator home page (calendar view)
│   ├── index.css              # Global styles & design tokens
│   ├── components/
│   │   ├── Shell.jsx          # Layout wrapper with ambient bg
│   │   ├── CalendarView.jsx   # Day calendar with drag-to-reorder
│   │   ├── DraggableBlock.jsx # Individual draggable calendar block
│   │   ├── AddEditModal.jsx   # Bottom sheet for add/edit stops
│   │   ├── LocationInput.jsx  # Location search with autocomplete
│   │   ├── SharedTileView.jsx # Bento tile grid (shared view)
│   │   └── TileCard.jsx       # Individual tile with reactions
│   ├── hooks/
│   │   └── useSupabase.js     # All Supabase hooks (plans, stops, reactions)
│   ├── lib/
│   │   ├── supabase.js        # Supabase client + slug generator
│   │   └── constants.js       # Categories, helpers, location DB
│   └── pages/
│       └── SharedView.jsx     # /p/:slug route — loads plan from Supabase
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Full database schema
├── .env.example
├── vercel.json                # SPA routing for Vercel
├── vite.config.js
└── package.json
```

---

## How Shareable Links Work

This is the core feature — here's exactly how to implement it end-to-end.

### The Flow

```
Creator makes a plan → Hits "Share" → Gets a link like:
https://note-that-down.com/p/xK9mQ2bz

They paste it in their group chat → Friends tap it →
See the beautiful tile view → React with emojis in real-time
```

### Step 1: Database Schema

Each plan gets a unique `share_slug` — a short, URL-safe string generated with nanoid:

```sql
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  share_slug text unique not null,  -- "xK9mQ2bz"
  name text not null,
  plan_date date,
  created_at timestamptz default now()
);
```

The slug is indexed for fast lookups. 8 characters gives you 2.8 trillion unique combos — more than enough.

### Step 2: Creating a Shareable Plan

When the user taps **"Share"**, the app:

1. Generates a slug: `nanoid(8)` → `"xK9mQ2bz"`
2. Inserts the plan + stops into Supabase
3. Constructs the URL: `https://note-that-down.com/p/xK9mQ2bz`
4. Copies it to the clipboard (or opens the native share sheet)

```javascript
// In your Share button handler:
import { nanoid } from 'nanoid';
import { supabase } from './lib/supabase';

async function handleShare(planName, planDate, stops) {
  const slug = nanoid(8);

  // 1. Create the plan
  const { data: plan } = await supabase
    .from('plans')
    .insert({ share_slug: slug, name: planName, plan_date: planDate })
    .select()
    .single();

  // 2. Insert all stops
  const stopsToInsert = stops.map((s, i) => ({
    plan_id: plan.id,
    title: s.title,
    location: s.location,
    notes: s.notes,
    category: s.category,
    start_hour: s.start_hour,
    start_min: s.start_min,
    duration: s.duration,
    sort_order: i,
  }));

  await supabase.from('stops').insert(stopsToInsert);

  // 3. Build & copy the URL
  const shareUrl = `https://note-that-down.com/p/${slug}`;
  await navigator.clipboard.writeText(shareUrl);

  // 4. Optional: native share sheet on mobile
  if (navigator.share) {
    await navigator.share({
      title: planName,
      text: `Check out our plan: ${planName}`,
      url: shareUrl,
    });
  }

  return shareUrl;
}
```

### Step 3: Routing

React Router handles two routes:

```jsx
<Routes>
  <Route path="/" element={<App />} />          {/* Creator view */}
  <Route path="/p/:slug" element={<SharedView />} />  {/* Shared tile view */}
</Routes>
```

The `/p/` prefix keeps share URLs clean and avoids collisions with future routes.

### Step 4: Loading a Shared Plan

When someone opens `note-that-down.com/p/xK9mQ2bz`, the `SharedView` page:

1. Extracts the slug from the URL
2. Queries Supabase for the plan + stops
3. Renders the tile view
4. Subscribes to real-time reaction updates

```javascript
// In SharedView.jsx (already implemented):
const { slug } = useParams();
const { plan, stops, loading } = usePlan(slug);

// usePlan internally does:
const { data } = await supabase
  .from('plans')
  .select('*')
  .eq('share_slug', slug)
  .single();
```

### Step 5: Real-time Reactions

Reactions use Supabase Realtime so everyone in the group chat sees votes appear live:

```javascript
// Subscribe to reaction changes
supabase
  .channel('reactions:live')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'reactions',
  }, (payload) => {
    // Refresh reaction counts
    loadReactions(stopIds);
  })
  .subscribe();
```

Each visitor gets an anonymous session ID (stored in localStorage) so they can toggle reactions without signing up.

### Step 6: Open Graph Meta Tags (for group chat previews)

When someone pastes the link in iMessage/WhatsApp/Discord, you want a rich preview. Add dynamic OG tags with a serverless function:

```javascript
// api/og/[slug].js (Vercel serverless function)
export default async function handler(req, res) {
  const { slug } = req.query;

  const { data: plan } = await supabase
    .from('plans')
    .select('name, plan_date')
    .eq('share_slug', slug)
    .single();

  const { count } = await supabase
    .from('stops')
    .select('*', { count: 'exact', head: true })
    .eq('plan_id', plan.id);

  // Return HTML with OG meta tags
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta property="og:title" content="${plan.name}" />
      <meta property="og:description" content="${count} stops planned for ${plan.plan_date || 'soon'}" />
      <meta property="og:image" content="https://note-that-down.com/api/og-image/${slug}" />
      <meta property="og:url" content="https://note-that-down.com/p/${slug}" />
      <meta name="twitter:card" content="summary_large_image" />
      <script>window.location.href = '/p/${slug}';</script>
    </head>
    </html>
  `);
}
```

### Step 7: Deployment Checklist

1. **Supabase**: Create project, run migration, get API keys
2. **Vercel**: Connect repo, set env vars, deploy
3. **Domain**: Point `note-that-down.com` to Vercel
4. **Vercel config**: The `vercel.json` handles SPA routing (`/p/*` → `index.html`)
5. **RLS**: Row Level Security is pre-configured in the migration — plans/stops are publicly readable, reactions use anonymous session IDs

---

## Upgrading to Production

### Replace Local Location Search with Google Places

In `LocationInput.jsx`, swap `searchPlaces()` for the Google Places Autocomplete API:

```javascript
// npm install @googlemaps/js-api-loader
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({ apiKey: 'YOUR_KEY', libraries: ['places'] });
const { AutocompleteService } = await loader.importLibrary('places');
const service = new AutocompleteService();

const results = await service.getPlacePredictions({ input: query });
```

### Add Authentication (Optional)

For plan editing/ownership, add Supabase Auth:

```javascript
// Google OAuth
const { data } = await supabase.auth.signInWithOAuth({ provider: 'google' });

// Then update RLS policies to check auth.uid()
```

### Generate OG Images

Use `@vercel/og` or Satori to generate dynamic preview images for each plan.

---

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (Postgres + Realtime + Auth + RLS)
- **Routing**: React Router v6
- **Styling**: CSS-in-JS with CSS custom properties
- **IDs**: nanoid for URL-safe slugs
- **Hosting**: Vercel (or any static host)
- **Fonts**: Anybody (display) + Figtree (body)
# ntd
