// TypeScript types for the Tinder for Movies application

/**
 * Database table types
 * These match the Supabase schema exactly
 */

export interface Movie {
  id: string;
  title: string;
  year: number;
  poster_url: string | null;
  genres: string[];
  description: string | null;
  created_at: string;
}

export interface Session {
  id: string;
  session_name: string | null;
  created_at: string;
}

export interface User {
  id: string;
  session_id: string;
  display_name: string;
  created_at: string;
}

export interface Swipe {
  id: string;
  user_id: string;
  movie_id: string;
  choice: 'yes' | 'no';
  created_at: string;
}

/**
 * Extended types for API responses and UI components
 */

export interface SessionWithUsers extends Session {
  users: User[];
}

export interface UserWithSwipes extends User {
  swipes: Swipe[];
}

export interface SwipeWithMovie extends Swipe {
  movie: Movie;
}

/**
 * Request/Response types for API operations
 */

export interface CreateSessionRequest {
  session_name?: string;
}

export interface CreateSessionResponse {
  session: Session;
}

export interface CreateUsersRequest {
  session_id: string;
  user_a_name: string;
  user_b_name: string;
}

export interface CreateUsersResponse {
  users: User[];
}

export interface CreateSwipeRequest {
  user_id: string;
  movie_id: string;
  choice: 'yes' | 'no';
}

export interface CreateSwipeResponse {
  swipe: Swipe;
}

export interface GetMatchesResponse {
  matches: Movie[];
}

/**
 * Component prop types
 */

export interface MovieCardProps {
  movie: Movie;
  onSwipe: (choice: 'yes' | 'no') => void;
  isLoading?: boolean;
}

export interface SwipeButtonsProps {
  onNo: () => void;
  onYes: () => void;
  disabled?: boolean;
}

export interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export interface HandoverScreenProps {
  fromUser: User;
  toUser: User;
  onContinue: () => void;
}

export interface ResultsListProps {
  matches: Movie[];
  sessionId: string;
}

/**
 * Utility types
 */

export type SwipeChoice = 'yes' | 'no';

export interface SwipeState {
  currentMovieIndex: number;
  totalMovies: number;
  isComplete: boolean;
}
