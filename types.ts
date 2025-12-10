export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  skillsOffered: Skill[];
  skillsWanted: string[]; // Just names of skills they want to learn
  isOnline?: boolean;
}

export interface MatchResult {
  user: UserProfile;
  matchScore: number;
  matchReason: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface ChatSession {
  matchId: string;
  messages: Message[];
}
