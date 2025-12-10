# Tinder for Movies - MVP Architecture

## 1. Data Model & Supabase Schema

### Database Tables

#### `movies`
Stores the movie catalog that users will swipe through.
```sql
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  poster_url TEXT,
  genres TEXT[], -- Array of genre strings
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `sessions`
Represents a matching session between users.
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `users`
Represents participants in a session (User A and User B).
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `swipes`
Records each user's swipe decision on a movie.
```sql
CREATE TABLE swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  choice TEXT NOT NULL CHECK (choice IN ('yes', 'no')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id) -- Prevent duplicate swipes
);
```

### Indexes for Performance
```sql
CREATE INDEX idx_swipes_user_id ON swipes(user_id);
CREATE INDEX idx_swipes_movie_id ON swipes(movie_id);
CREATE INDEX idx_users_session_id ON users(session_id);
```

## 2. Data Flow

### Session Creation Flow
1. User lands on homepage `/`
2. Clicks "Start New Session"
3. App creates a new session in Supabase `sessions` table
4. Redirects to `/session/[sessionId]/setup`

### Setup Flow
1. User enters names for User A and User B
2. App creates two records in `users` table with the session_id
3. Redirects to `/session/[sessionId]/swipe/[userAId]`

### Swiping Flow (User A)
1. Page loads the first movie from `movies` table
2. User swipes/clicks Yes or No
3. App records swipe in `swipes` table
4. App loads next movie
5. Repeat until all movies are swiped
6. Redirect to handover screen or User B's swipe page

### Swiping Flow (User B)
1. Same as User A
2. After User B finishes, redirect to `/session/[sessionId]/results`

### Match Calculation
1. Query all swipes for both users in the session
2. Find movies where BOTH users have `choice = 'yes'`
3. Display matched movies with poster and title

**SQL for Match Calculation:**
```sql
SELECT m.*
FROM movies m
INNER JOIN swipes s1 ON m.id = s1.movie_id
INNER JOIN swipes s2 ON m.id = s2.movie_id
WHERE s1.user_id = 'user_a_id'
  AND s2.user_id = 'user_b_id'
  AND s1.choice = 'yes'
  AND s2.choice = 'yes';
```

## 3. Next.js App Structure (App Router)

```
app/
├── layout.tsx                          # Root layout with Tailwind
├── page.tsx                            # Landing page: "Start Session"
├── globals.css                         # Tailwind imports
├── session/
│   └── [sessionId]/
│       ├── setup/
│       │   └── page.tsx               # Enter User A & B names
│       ├── swipe/
│       │   └── [userId]/
│       │       └── page.tsx           # Swipe UI for a user
│       └── results/
│           └── page.tsx               # Show matched movies
│
components/
├── MovieCard.tsx                       # Movie swipe card component
├── SwipeButtons.tsx                    # Yes/No buttons
├── ProgressIndicator.tsx               # "Movie X of Y"
├── HandoverScreen.tsx                  # "Now it's User B's turn"
└── ResultsList.tsx                     # Display matches
│
lib/
├── supabase.ts                         # Supabase client setup
├── types.ts                            # TypeScript types
└── api/
    ├── sessions.ts                     # Session CRUD functions
    ├── users.ts                        # User CRUD functions
    ├── swipes.ts                       # Swipe CRUD functions
    └── matches.ts                      # Match calculation logic
```

## 4. Route Descriptions

### `/` (Landing Page)
- **Purpose**: Entry point to create a new session
- **Data**: None
- **Actions**:
  - "Start New Session" button → creates session → redirects to setup

### `/session/[sessionId]/setup` (Setup Page)
- **Purpose**: Collect names for User A and User B
- **Data**: Loads session info from Supabase
- **Actions**:
  - Form with two text inputs
  - "Start Swiping" button → creates two users → redirects to User A's swipe page

### `/session/[sessionId]/swipe/[userId]` (Swipe Page)
- **Purpose**: Show movies one at a time for swiping
- **Data**:
  - Current user info
  - Movies list (filtered by movies not yet swiped by this user)
  - Current movie index
- **Actions**:
  - Swipe left/right or click No/Yes
  - Save swipe to database
  - Load next movie
  - When done: show handover screen or redirect to results

### `/session/[sessionId]/results` (Results Page)
- **Purpose**: Display matched movies
- **Data**:
  - Both users' info
  - All swipes for the session
  - Calculated matches
- **Actions**:
  - View matched movies
  - Optional: "Start New Session" button

## 5. Key Technical Decisions

### Authentication
- **No auth required** for MVP - sessions are anonymous
- Anyone with the session URL can access it
- Future: Add simple magic link or pin code protection

### State Management
- Server-side data fetching with Next.js App Router
- No client-side state management library needed (React state is sufficient)

### Mobile Gestures
- Use `react-swipeable` or `framer-motion` for swipe gestures
- Fallback to buttons for desktop

### Movie Data
- Start with 30-50 hardcoded popular movies
- Seed data via SQL script
- Future: Integrate with TMDB API

### Performance Optimizations
- Use Next.js Image component for posters
- Preload next movie image while user is viewing current one
- Use Supabase indexes for fast queries

## 6. MVP Shortcuts & Future Improvements

### MVP Shortcuts
1. No authentication (sessions are public)
2. Fixed 2 users per session
3. Hardcoded movie list (no API integration)
4. No "undo" functionality
5. No session persistence in browser (refresh loses state)
6. No ability to restart or create multiple sessions easily

### Future Enhancements
1. Add pin code or magic link to protect sessions
2. Support 3+ users in a session
3. Integrate TMDB API for real movie data
4. Add filters (genre, year, rating)
5. Add "undo" button during swiping
6. Show preview of next movie
7. Add animations/transitions
8. Export matches to a watch list
9. Social sharing of matches
10. Analytics on popular movies
