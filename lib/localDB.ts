// ============================================================================
// LocalStorage Database - Thay thế MongoDB khi test
// ============================================================================
// Ưu điểm:
// - Không cần backend/database
// - Setup cực nhanh (5 phút)
// - Dữ liệu không mất khi reload trang
//
// Nhược điểm:
// - Dữ liệu chỉ lưu trên 1 thiết bị
// - Không đồng bộ giữa các devices
// - Bảo mật thấp (không nên dùng cho production)
// ============================================================================

export interface Profile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bio: string;
  email: string;
  password?: string;
  avatar?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  createdAt: string;
}

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  status: 'pending' | 'scheduled' | 'completed';
  scheduledDate?: string;
  createdAt: string;
}

export interface Availability {
  id: string;
  matchId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

class LocalStorageDB {
  private get<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private set<T>(key: string, value: T[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Profiles
  getProfiles(): Profile[] {
    return this.get<Profile>('dating_profiles');
  }

  saveProfile(profile: Profile): void {
    const profiles = this.getProfiles();
    // Check if exists
    const index = profiles.findIndex(p => p.email === profile.email);
    if (index !== -1) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    this.set('dating_profiles', profiles);
  }

  getProfileByEmail(email: string): Profile | undefined {
    return this.getProfiles().find(p => p.email === email);
  }

  // Likes
  getLikes(): Like[] {
    return this.get<Like>('dating_likes');
  }

  /**
   * Lưu like mới
   * @returns true nếu like mới, false nếu đã like rồi
   */
  saveLike(like: Like): boolean {
    const likes = this.getLikes();
    // Check if already liked (chống duplicate like)
    const exists = likes.find(l =>
      l.fromUserId === like.fromUserId && l.toUserId === like.toUserId
    );
    if (!exists) {
      likes.push(like);
      this.set('dating_likes', likes);
      return true;
    }
    return false;
  }

  /**
   * Kiểm tra match - Logic 2-way like
   * @returns true nếu cả 2 người đã like nhau
   */
  checkMatch(userId1: string, userId2: string): boolean {
    const likes = this.getLikes();
    // Kiểm tra user1 đã like user2 chưa
    const user1LikesUser2 = likes.some(l =>
      l.fromUserId === userId1 && l.toUserId === userId2
    );
    // Kiểm tra user2 đã like user1 chưa
    const user2LikesUser1 = likes.some(l =>
      l.fromUserId === userId2 && l.toUserId === userId1
    );
    // Match nếu cả 2 đã like nhau
    return user1LikesUser2 && user2LikesUser1;
  }

  // Matches
  getMatches(): Match[] {
    return this.get<Match>('dating_matches');
  }

  /**
   * Lưu match mới
   * @returns true nếu match mới, false nếu đã tồn tại
   */
  saveMatch(match: Match): boolean {
    const matches = this.getMatches();
    // Check if match already exists (không phân biệt thứ tự userA/userB)
    const exists = matches.find(m =>
      (m.userAId === match.userAId && m.userBId === match.userBId) ||
      (m.userAId === match.userBId && m.userBId === match.userAId)
    );
    if (!exists) {
      matches.push(match);
      this.set('dating_matches', matches);
      return true;
    }
    return false;
  }

  /**
   * Cập nhật thông tin match (status, scheduledDate)
   */
  updateMatch(matchId: string, updates: Partial<Match>): void {
    const matches = this.getMatches();
    const index = matches.findIndex(m => m.id === matchId);
    if (index !== -1) {
      matches[index] = { ...matches[index], ...updates };
      this.set('dating_matches', matches);
    }
  }

  /**
   * Lưu availability, replace availability cũ của cùng 1 user trong match
   */
  saveAvailability(availability: Availability): void {
    const availabilities = this.getAvailabilities();
    // Remove old availability for this user in this match
    const filtered = availabilities.filter(a =>
      !(a.matchId === availability.matchId && a.userId === availability.userId)
    );
    filtered.push(availability);
    this.set('dating_availabilities', filtered);
  }

  getAvailabilityByMatchAndUser(matchId: string, userId: string): Availability | undefined {
    return this.getAvailabilities().find(a => 
      a.matchId === matchId && a.userId === userId
    );
  }

  /**
   * Tìm slot trùng giữa 2 availabilities
   * Algorithm:
   * 1. Check cùng ngày (nếu khác ngày → null)
   * 2. commonStart = MAX(start1, start2) - lấy giờ bắt đầu muộn hơn
   * 3. commonEnd = MIN(end1, end2) - lấy giờ kết thúc sớm hơn
   * 4. Nếu commonStart < commonEnd → có slot trùng
   * 
   * @returns Slot trùng hoặc null nếu không có
   */
  findCommonSlot(avail1: Availability, avail2: Availability): { date: string; startTime: string; endTime: string } | null {
    // Step 1: Check cùng ngày
    if (avail1.date !== avail2.date) return null;

    // Step 2: Tìm giờ bắt đầu chung (muộn hơn)
    const commonStart = avail1.startTime > avail2.startTime ? avail1.startTime : avail2.startTime;
    
    // Step 3: Tìm giờ kết thúc chung (sớm hơn)
    const commonEnd = avail1.endTime < avail2.endTime ? avail1.endTime : avail2.endTime;

    // Step 4: Check valid slot
    if (commonStart < commonEnd) {
      return { date: avail1.date, startTime: commonStart, endTime: commonEnd };
    }
    return null;
  }

  /**
   * Xóa toàn bộ dữ liệu (dùng cho testing)
   */
  clear(): void {
    localStorage.removeItem('dating_profiles');
    localStorage.removeItem('dating_likes');
    localStorage.removeItem('dating_matches');
    localStorage.removeItem('dating_availabilities');
    localStorage.removeItem('dating_current_user');
  }
}

// Export singleton instance
export const localDB = new LocalStorageDB();

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
