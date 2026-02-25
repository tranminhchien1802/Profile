// Utility functions để lưu trữ dữ liệu vào localStorage
// Giúp data không mất khi reload trang

import { Profile, Like, Match, Availability } from '../types';

const STORAGE_KEYS = {
  PROFILES: 'dating_app_profiles',
  LIKES: 'dating_app_likes',
  MATCHES: 'dating_app_matches',
  AVAILABILITIES: 'dating_app_availabilities',
  CURRENT_USER: 'dating_app_current_user',
};

// Helper để đọc/ghi localStorage
export const storage = {
  // Profiles
  getProfiles: (): Profile[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
    return data ? JSON.parse(data) : [];
  },

  saveProfile: (profile: Profile) => {
    const profiles = storage.getProfiles();
    profiles.push(profile);
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  },

  getProfileById: (id: string): Profile | undefined => {
    const profiles = storage.getProfiles();
    return profiles.find(p => p.id === id);
  },

  // Likes
  getLikes: (): Like[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.LIKES);
    return data ? JSON.parse(data) : [];
  },

  saveLike: (like: Like) => {
    const likes = storage.getLikes();
    // Check nếu đã like rồi thì không like lại
    const exists = likes.find(l => l.fromUserId === like.fromUserId && l.toUserId === like.toUserId);
    if (!exists) {
      likes.push(like);
      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likes));
    }
  },

  // Matches
  getMatches: (): Match[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.MATCHES);
    return data ? JSON.parse(data) : [];
  },

  saveMatch: (match: Match) => {
    const matches = storage.getMatches();
    // Check nếu match đã tồn tại
    const exists = matches.find(m => 
      (m.userAId === match.userAId && m.userBId === match.userBId) ||
      (m.userAId === match.userBId && m.userBId === match.userAId)
    );
    if (!exists) {
      matches.push(match);
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    }
    return !exists;
  },

  updateMatch: (matchId: string, updates: Partial<Match>) => {
    const matches = storage.getMatches();
    const index = matches.findIndex(m => m.id === matchId);
    if (index !== -1) {
      matches[index] = { ...matches[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    }
  },

  // Availabilities
  getAvailabilities: (): Availability[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.AVAILABILITIES);
    return data ? JSON.parse(data) : [];
  },

  saveAvailability: (availability: Availability) => {
    const availabilities = storage.getAvailabilities();
    // Xóa availability cũ của user này trong match này
    const filtered = availabilities.filter(a => 
      !(a.matchId === availability.matchId && a.userId === availability.userId)
    );
    filtered.push(availability);
    localStorage.setItem(STORAGE_KEYS.AVAILABILITIES, JSON.stringify(filtered));
  },

  getAvailabilityByMatchAndUser: (matchId: string, userId: string): Availability | undefined => {
    const availabilities = storage.getAvailabilities();
    return availabilities.find(a => a.matchId === matchId && a.userId === userId);
  },

  // Current User (để biết ai đang dùng)
  getCurrentUser: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  },

  setCurrentUser: (email: string) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, email);
  },
};

// Hàm tạo ID ngẫu nhiên
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Hàm kiểm tra 2 người đã match chưa
export const checkMatch = (userAId: string, userBId: string): boolean => {
  const likes = storage.getLikes();
  const aLikesB = likes.some(l => l.fromUserId === userAId && l.toUserId === userBId);
  const bLikesA = likes.some(l => l.fromUserId === userBId && l.toUserId === userAId);
  return aLikesB && bLikesA;
};

// Hàm tìm slot trùng nhau giữa 2 người
export const findCommonSlot = (
  availA: Availability,
  availB: Availability
): { date: string; startTime: string; endTime: string } | null => {
  // Nếu khác ngày thì không có slot trùng
  if (availA.date !== availB.date) {
    return null;
  }

  // Tìm khoảng thời gian trùng
  const commonStart = availA.startTime > availB.startTime ? availA.startTime : availB.startTime;
  const commonEnd = availA.endTime < availB.endTime ? availA.endTime : availB.endTime;

  // Nếu commonStart < commonEnd thì có slot trùng
  if (commonStart < commonEnd) {
    return {
      date: availA.date,
      startTime: commonStart,
      endTime: commonEnd,
    };
  }

  return null;
};
