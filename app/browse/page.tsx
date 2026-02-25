'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/app/types';
import { useToast } from '../components/ToastProvider';
import { ProfileCardSkeleton } from '../components/Skeletons';

export default function BrowsePage() {
  const router = useRouter();
  const { showSuccess, showError, showInfo } = useToast();
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [matchedProfiles, setMatchedProfiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadProfiles();
  }, []);

  const checkAuth = () => {
    try {
      const savedUser = localStorage.getItem('dating_current_user');
      if (!savedUser) {
        router.push('/login');
        return;
      }
      setCurrentUser(JSON.parse(savedUser));
    } catch (error) {
      showError('Không thể xác thực. Vui lòng đăng nhập lại.');
      router.push('/login');
    }
  };

  const loadProfiles = async () => {
    try {
      // Load profiles directly from localStorage
      const profilesJson = localStorage.getItem('dating_profiles');
      const allProfiles: any[] = profilesJson ? JSON.parse(profilesJson) : [];
      
      // Filter out current user's profile
      const filteredProfiles = allProfiles.filter(p => p.id !== currentUser?.id);
      setProfiles(filteredProfiles);
      
      // Load liked profiles
      const likesJson = localStorage.getItem('dating_likes');
      const likes: any[] = likesJson ? JSON.parse(likesJson) : [];
      const likedIds = new Set<string>(
        likes.filter(l => l.fromUserId === currentUser?.id).map(l => l.toUserId)
      );
      setLikedProfiles(likedIds);

      // Load matches
      const matchesJson = localStorage.getItem('dating_matches');
      const matches: any[] = matchesJson ? JSON.parse(matchesJson) : [];
      const matchedIds = new Set<string>(
        matches
          .filter(m => m.userAId === currentUser?.id || m.userBId === currentUser?.id)
          .map(m => {
            const otherUserId = m.userAId === currentUser?.id ? m.userBId : m.userAId;
            return otherUserId;
          })
      );
      setMatchedProfiles(matchedIds);
    } catch (error) {
      console.error('Load error:', error);
      showError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (profileId: string, profileName: string) => {
    if (!currentUser || liking) return;

    // Prevent liking yourself
    if (profileId === currentUser.id) {
      showError('Không thể like chính mình!');
      setLiking(null);
      return;
    }

    setLiking(profileId);
    try {
      // Check if already liked
      const likesJson = localStorage.getItem('dating_likes');
      const likes: any[] = likesJson ? JSON.parse(likesJson) : [];

      const alreadyLiked = likes.some(l =>
        l.fromUserId === currentUser.id && l.toUserId === profileId
      );

      if (alreadyLiked) {
        showError('Bạn đã like profile này rồi');
        setLiking(null);
        return;
      }

      // Tạo like
      const like = {
        id: 'like_' + Date.now(),
        fromUserId: currentUser.id,
        toUserId: profileId,
        createdAt: new Date().toISOString(),
      };
      
      likes.push(like);
      localStorage.setItem('dating_likes', JSON.stringify(likes));

      // Kiểm tra match (user kia đã like mình chưa)
      const isMatch = likes.some(l => 
        l.fromUserId === profileId && l.toUserId === currentUser.id
      );

      if (isMatch) {
        // Tạo match mới
        const matchesJson = localStorage.getItem('dating_matches');
        const matches: any[] = matchesJson ? JSON.parse(matchesJson) : [];
        
        const newMatch = {
          id: 'match_' + Date.now(),
          userAId: currentUser.id,
          userBId: profileId,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        
        matches.push(newMatch);
        localStorage.setItem('dating_matches', JSON.stringify(matches));
        
        showSuccess(`🎉 Match với ${profileName}! Hai bạn có thể nhắn tin cho nhau.`);
        setMatchedProfiles(prev => new Set(prev).add(profileId));
      } else {
        showInfo(`Đã thích ${profileName}`);
        setLikedProfiles(prev => new Set(prev).add(profileId));
      }
    } catch (error: any) {
      showError(error.message || 'Không thể like. Vui lòng thử lại.');
    } finally {
      setLiking(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dating_current_user');
    showSuccess('Đã đăng xuất');
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                Khám phá
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {profiles.length} profiles tiềm năng
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/matches')}
                className="px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                💑 Matches
              </button>
              {currentUser && (
                <>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-700">{currentUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    title="Đăng xuất"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProfileCardSkeleton key={i} />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Chưa có profile nào
            </h3>
            <p className="text-gray-500 mb-6">
              Hãy là người đầu tiên tạo profile!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => {
              const profileId = profile._id || profile.id || '';
              const isLiked = likedProfiles.has(profileId);
              const isMatched = matchedProfiles.has(profileId);
              const isProcessing = liking === profileId;

              return (
                <div
                  key={profileId}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-rose-200 transition-all duration-300"
                >
                  {/* Header Image */}
                  <div className="relative h-40 bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600">
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                  
                  {/* Avatar */}
                  <div className="relative px-6">
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
                        }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-20 pb-6 px-6">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {profile.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">{profile.age} tuổi</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-600">
                          {profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'}
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                      <p className="text-sm text-gray-600 text-center mb-6 line-clamp-3">
                        {profile.bio}
                      </p>
                    )}

                    {/* Action Button */}
                    {isMatched ? (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 py-2.5 rounded-lg font-medium text-sm text-center">
                        ✅ Đã match
                      </div>
                    ) : isLiked ? (
                      <div className="bg-gray-100 text-gray-500 py-2.5 rounded-lg font-medium text-sm text-center">
                        ✓ Đã thích
                      </div>
                    ) : (
                      <button
                        onClick={() => handleLike(profileId, profile.name)}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2.5 rounded-lg font-medium hover:from-rose-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
                      >
                        {isProcessing ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            Thích
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-12 py-6">
        <div className="text-center text-gray-500 text-sm">
          <p>Dating App © 2024</p>
          <p className="text-xs mt-1">Kết nối chân thành - Yêu thương bền vững</p>
        </div>
      </footer>
    </div>
  );
}
