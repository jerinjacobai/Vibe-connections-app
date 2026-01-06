export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  jobTitle: string; // Kept for compatibility, can be used as "Status"
  interests: string[];
  vibes: string[]; // Specific buddy types: "Smoke Buddy", "FIFA Buddy", etc.
  imageUrl: string;
  distance: number; // in miles
  mood: string; // e.g., "Spontaneous", "Chill", "Wild"
  lookingFor: string; // e.g., "Right now", "Short term", "Chat"
  rating: number; // 0-10 scale
  ratingCount: number;
}

export interface Match {
  id: string;
  userId: string;
  profile: UserProfile;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: Date;
}

export type AppScreen = 'auth' | 'vibe-check' | 'swipe' | 'matches' | 'chat' | 'profile';

export interface ChatSession {
  matchId: string;
  messages: Message[];
}