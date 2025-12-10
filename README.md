# 🎬 Tinder for Movies

A swipe-based movie matching app that helps two people quickly find movies they both want to watch. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## 🎯 Product Overview

**The Problem:** Two people want to watch a movie together but can't decide what to watch.

**The Solution:** Each person swipes through a list of movies independently on the same device. The app then shows only the movies that both people liked.

### Key Features

- ✅ Pass-the-phone style interface (single device, two users)
- ✅ Swipe left (No) or right (Yes) on movies
- ✅ Touch gestures on mobile, buttons on desktop
- ✅ Real-time progress tracking
- ✅ Beautiful, modern UI with Tailwind CSS
- ✅ Fast match calculation
- ✅ No authentication required (anonymous sessions)

## 🏗️ Tech Stack

- **Frontend:** Next.js 14+ (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** None (MVP uses anonymous sessions)
- **Deployment:** Vercel + Supabase

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** 18+ installed ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- A **Supabase account** ([Sign up free](https://supabase.com))
- A **Vercel account** for deployment ([Sign up free](https://vercel.com))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Tinder-netflix
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name:** Tinder for Movies
   - **Database Password:** Choose a strong password
   - **Region:** Select closest to your users
4. Click "Create new project" (takes ~2 minutes)

#### Run the Database Schema

1. In your Supabase project, click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click "Run" (bottom right)
6. You should see "Success. No rows returned"

#### Seed the Database with Movies

1. In the SQL Editor, create another new query
2. Copy the entire contents of `supabase/seed.sql`
3. Paste into the SQL editor
4. Click "Run"
5. You should see "Successfully inserted 40 movies"

#### Get Your Supabase Credentials

1. Click "Settings" (gear icon) in the left sidebar
2. Click "API" under Project Settings
3. Copy these two values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### 4. Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the landing page!

## 🎮 How to Use

1. **Start a Session**
   - Click "Start New Session" on the homepage
   - Enter names for both people (e.g., "Alex" and "Sam")
   - Click "Start Swiping"

2. **Person A Swipes**
   - Person A swipes through all movies
   - Swipe left (or click ❌) for "No"
   - Swipe right (or click ❤️) for "Yes"
   - Progress bar shows how many movies remain

3. **Pass to Person B**
   - When Person A is done, a handover screen appears
   - Pass the device to Person B
   - Click "Let's Go!"

4. **Person B Swipes**
   - Person B swipes through the same movies
   - Same process as Person A

5. **View Matches**
   - After both are done, see your matched movies!
   - Click "Start New Session" to try again

## 📁 Project Structure

```
Tinder-netflix/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Global styles
│   └── session/
│       └── [sessionId]/
│           ├── setup/                # Name entry page
│           ├── swipe/[userId]/       # Swipe interface
│           └── results/              # Match results
│
├── components/                       # React components
│   ├── MovieCard.tsx                 # Movie display card
│   ├── SwipeButtons.tsx              # Yes/No buttons
│   ├── ProgressIndicator.tsx         # Progress bar
│   ├── HandoverScreen.tsx            # Device handover UI
│   └── ResultsList.tsx               # Match results display
│
├── lib/                              # Utilities and API
│   ├── supabase.ts                   # Supabase client
│   ├── types.ts                      # TypeScript types
│   └── api/
│       ├── sessions.ts               # Session CRUD
│       ├── users.ts                  # User CRUD
│       ├── movies.ts                 # Movie queries
│       ├── swipes.ts                 # Swipe recording
│       └── matches.ts                # Match calculation
│
├── supabase/                         # Database files
│   ├── schema.sql                    # Database schema
│   └── seed.sql                      # Sample movie data
│
└── public/                           # Static assets
```

## 🚢 Deployment

### Deploy to Vercel

1. **Install Vercel CLI (optional)**

```bash
npm i -g vercel
```

2. **Deploy via Vercel Dashboard (Recommended)**

   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Or Deploy via CLI**

```bash
vercel
```

Follow the prompts and add your environment variables when asked.

### Deploy Supabase (Already Done!)

Your Supabase database is already hosted and deployed when you created the project. No additional steps needed!

## 🔧 Configuration

### Customize Movie List

To add more movies or change the existing ones:

1. Edit `supabase/seed.sql`
2. Run the SQL in your Supabase SQL Editor
3. Or manually add movies via Supabase Table Editor:
   - Go to "Table Editor" → "movies"
   - Click "Insert row"

### Change Number of Movies

By default, users swipe through all movies in the database. To limit this:

Edit `app/session/[sessionId]/swipe/[userId]/page.tsx` and modify the `getAllMovies()` call to use `getRandomMovies(30)` instead.

## 📚 API Documentation

### Database Schema

See `ARCHITECTURE.md` for detailed schema documentation.

**Key Tables:**
- `movies` - Movie catalog
- `sessions` - Matching sessions
- `users` - Participants (User A & B)
- `swipes` - Swipe decisions

### Match Calculation

Matches are calculated using a PostgreSQL function:

```sql
SELECT * FROM get_session_matches('session-uuid-here');
```

This returns all movies where BOTH users swiped "yes".

## 🐛 Troubleshooting

### "Failed to create session"

- Check that your `.env` file has the correct Supabase credentials
- Verify Supabase is running (check [status.supabase.com](https://status.supabase.com))
- Check browser console for detailed errors

### "Failed to load movies"

- Ensure you ran `supabase/seed.sql` in your Supabase SQL Editor
- Check that movies exist: Go to Supabase → Table Editor → movies
- Verify Row Level Security policies are set (they're in `schema.sql`)

### Swipes not saving

- Check browser console for errors
- Verify your Supabase anon key has write permissions
- Check Supabase logs: Dashboard → Logs → Postgres Logs

### Images not loading

- TMDB image URLs may occasionally be slow or blocked
- Check your network inspector for 404s or CORS errors
- Fallback movie icon (🎬) will show if poster fails to load

## 🎯 MVP Shortcuts & Future Improvements

### Current Limitations (MVP)

1. ✋ **No Authentication** - Sessions are public (anyone with URL can access)
2. ✋ **Fixed 2 Users** - Can't add more than 2 people per session
3. ✋ **Hardcoded Movies** - 40 sample movies, no dynamic API
4. ✋ **No Undo** - Can't go back after swiping
5. ✋ **No Persistence** - Refresh loses current progress
6. ✋ **Single Session** - No history or "My Sessions" feature

### Future Enhancements

- 🔐 Add pin code protection for sessions
- 👥 Support 3+ users in a session
- 🎬 Integrate TMDB API for real-time movie data
- 🎨 Add genre/year filters
- ↩️ Undo button during swiping
- 📱 Native mobile apps
- 💾 Session history and favorites
- 🎲 "Surprise me" random picker from matches
- 📊 Analytics on most popular movies
- 🔗 Social sharing of match results

## 🤝 Contributing

This is an MVP project, but contributions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Movie posters from [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Icons from [Heroicons](https://heroicons.com/)
- Swipe gestures via [react-swipeable](https://github.com/FormidableLabs/react-swipeable)

## 📞 Support

Having issues?

1. Check this README's troubleshooting section
2. Review `ARCHITECTURE.md` for technical details
3. Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
4. Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)

---

**Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and Supabase**

Enjoy finding your next movie to watch together! 🎬🍿
