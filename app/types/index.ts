// Types cho Mini Dating App với MongoDB backend

export interface Profile {
  _id?: string;
  id?: string;
  userId?: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bio: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Like {
  _id?: string;
  id?: string;
  fromUserId: string | { _id: string; name: string; age: number; gender: string; avatar?: string };
  toUserId: string;
  createdAt?: string;
}

export interface Match {
  _id?: string;
  id?: string;
  userAId?: string | { _id: string; name: string; email: string; avatar?: string };
  userBId?: string | { _id: string; name: string; email: string; avatar?: string };
  otherUser?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: 'pending' | 'scheduled' | 'completed';
  scheduledDate?: string;
  createdAt?: string;
}

export interface Availability {
  _id?: string;
  id?: string;
  matchId: string;
  userId: string | { _id: string; name: string };
  date: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  error?: string;
  data?: T;
  profiles?: Profile[];
  profile?: Profile;
  matches?: any[];
  likes?: Like[];
  availabilities?: Availability[];
  isMatch?: boolean;
  matchedProfile?: Profile | null;
  commonSlot?: TimeSlot | null;
}
