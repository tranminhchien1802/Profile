'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Match, Availability } from '@/app/types';
import { useToast } from '../components/ToastProvider';
import { MatchCardSkeleton } from '../components/Skeletons';
import { validateTimeRange } from '../utils/validation';

interface MatchWithUser {
  id: string;
  status: 'pending' | 'scheduled' | 'completed';
  scheduledDate?: string;
  otherUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function MatchesPage() {
  const router = useRouter();
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [matches, setMatches] = useState<MatchWithUser[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchWithUser | null>(null);
  const [availabilityForm, setAvailabilityForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
  });
  const [myAvailability, setMyAvailability] = useState<Availability | null>(null);
  const [matchResult, setMatchResult] = useState<{
    success: boolean;
    message: string;
    date?: string;
    time?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    checkAuth();
    loadMatches();
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

  const loadMatches = async () => {
    try {
      // Load matches directly from localStorage
      const matchesJson = localStorage.getItem('dating_matches');
      const matches: any[] = matchesJson ? JSON.parse(matchesJson) : [];
      
      const currentUserJson = localStorage.getItem('dating_current_user');
      if (!currentUserJson) {
        router.push('/login');
        return;
      }
      
      const currentUser = JSON.parse(currentUserJson);
      const myProfileId = currentUser.id;

      // Filter matches for current user
      const userMatches = matches.filter(m =>
        m.userAId === myProfileId || m.userBId === myProfileId
      );

      // Load profiles to get other user info
      const profilesJson = localStorage.getItem('dating_profiles');
      const profiles: any[] = profilesJson ? JSON.parse(profilesJson) : [];

      // Format matches with other user info
      const formattedMatches = userMatches.map(match => {
        const otherUserId = match.userAId === myProfileId ? match.userBId : match.userAId;
        
        // Filter out matches where other user is the same as current user (invalid match)
        if (otherUserId === myProfileId) {
          return null;
        }
        
        const otherUser = profiles.find(p => p.id === otherUserId);

        return {
          id: match.id,
          status: match.status,
          scheduledDate: match.scheduledDate,
          createdAt: match.createdAt,
          otherUser: otherUser ? {
            id: otherUser.id,
            name: otherUser.name,
            email: otherUser.email,
            avatar: otherUser.avatar,
          } : null,
        };
      }).filter(match => match !== null && match.otherUser !== null);

      setMatches(formattedMatches);
    } catch (error) {
      console.error('Load matches error:', error);
      showError('Không thể tải danh sách matches');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailabilities = async (matchId: string) => {
    try {
      // Load availabilities directly from localStorage
      const availabilitiesJson = localStorage.getItem('dating_availabilities');
      const availabilities: any[] = availabilitiesJson ? JSON.parse(availabilitiesJson) : [];

      const myAvail = availabilities.find(a => {
        return a.matchId === matchId && a.userId === currentUser?.id;
      });

      setMyAvailability(myAvail || null);
    } catch (error) {
      console.error('Load availabilities error:', error);
    }
  };

  const handleSelectMatch = (match: MatchWithUser) => {
    setSelectedMatch(match);
    setMatchResult(null);
    setMyAvailability(null);
    setAvailabilityForm({ date: '', startTime: '', endTime: '' });
    setErrors({});
    loadAvailabilities(match.id);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!availabilityForm.date) {
      newErrors.date = 'Vui lòng chọn ngày';
    }

    const timeError = validateTimeRange(availabilityForm.startTime, availabilityForm.endTime);
    if (timeError) {
      newErrors.startTime = timeError;
      newErrors.endTime = timeError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAvailability = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMatch || !currentUser) return;
    if (!validateForm()) {
      showError('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setSaving(true);
    try {
      const { date, startTime, endTime } = availabilityForm;

      // Validate thời gian
      if (startTime >= endTime) {
        showError('Giờ bắt đầu phải trước giờ kết thúc');
        setSaving(false);
        return;
      }

      // Tạo availability
      const availability = {
        id: 'avail_' + Date.now(),
        matchId: selectedMatch.id,
        userId: currentUser.id,
        date,
        startTime,
        endTime,
        createdAt: new Date().toISOString(),
      };

      // Lưu vào localStorage
      const availabilitiesJson = localStorage.getItem('dating_availabilities');
      const availabilities: any[] = availabilitiesJson ? JSON.parse(availabilitiesJson) : [];
      
      // Remove old availability for this user in this match
      const filtered = availabilities.filter(a =>
        !(a.matchId === availability.matchId && a.userId === availability.userId)
      );
      filtered.push(availability);
      localStorage.setItem('dating_availabilities', JSON.stringify(filtered));

      // Kiểm tra xem đối phương đã chọn availability chưa
      const matchesJson = localStorage.getItem('dating_matches');
      const matches: any[] = matchesJson ? JSON.parse(matchesJson) : [];
      const match = matches.find(m => m.id === selectedMatch.id);
      
      if (!match) {
        showError('Match not found');
        setSaving(false);
        return;
      }

      const otherUserId = match.userAId === currentUser.id ? match.userBId : match.userAId;
      const otherAvailability = availabilities.find(a =>
        a.matchId === selectedMatch.id && a.userId === otherUserId
      );

      if (otherAvailability) {
        // Cả hai đã chọn, tìm slot trùng
        if (availability.date === otherAvailability.date) {
          const commonStart = availability.startTime > otherAvailability.startTime ? availability.startTime : otherAvailability.startTime;
          const commonEnd = availability.endTime < otherAvailability.endTime ? availability.endTime : otherAvailability.endTime;

          if (commonStart < commonEnd) {
            // Tìm thấy slot trùng
            const commonSlot = { date: availability.date, startTime: commonStart, endTime: commonEnd };
            
            setMatchResult({
              success: true,
              message: '✅ Tìm thấy lịch hẹn phù hợp!',
              date: commonSlot.date,
              time: `${commonSlot.startTime} - ${commonSlot.endTime}`,
            });
            showSuccess('Chúc mừng! Hai bạn đã tìm được lịch hẹn phù hợp');

            // Cập nhật match với scheduled date
            const updatedMatches = matches.map(m => {
              if (m.id === selectedMatch.id) {
                return { ...m, status: 'scheduled', scheduledDate: `${commonSlot.startTime} - ${commonSlot.endTime}` };
              }
              return m;
            });
            localStorage.setItem('dating_matches', JSON.stringify(updatedMatches));
            loadMatches();
          } else {
            setMatchResult({
              success: false,
              message: 'Không tìm thấy thời gian trùng. Vui lòng chọn lại.',
            });
            showWarning('Lịch của hai bạn không trùng nhau. Hãy thử chọn khung giờ khác.');
          }
        } else {
          setMatchResult({
            success: false,
            message: 'Không tìm thấy thời gian trùng. Vui lòng chọn lại.',
          });
          showWarning('Lịch của hai bạn không trùng nhau. Hãy thử chọn khung giờ khác.');
        }
      } else {
        setMyAvailability(availability);
        setAvailabilityForm({ date: '', startTime: '', endTime: '' });
        showInfo('Đã lưu thời gian rảnh. Đợi đối phương chọn thời gian...');
      }
    } catch (error: any) {
      showError(error.message || 'Không thể lưu thời gian rảnh');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dating_current_user');
    showSuccess('Đã đăng xuất');
    router.push('/login');
    router.refresh();
  };

  const getNextThreeWeeksDates = () => {
    const dates: { value: string; label: string; isWeekend: boolean }[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 21; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const value = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const label = date.toLocaleDateString('vi-VN', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'numeric' 
      });
      dates.push({ value, label, isWeekend });
    }
    
    return dates;
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                Matches
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {matches.length} matches • {matches.filter(m => m.status === 'scheduled').length} đã lên lịch
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/browse')}
                className="px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                🔍 Khám phá
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Danh sách matches */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Danh sách Matches
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <MatchCardSkeleton key={i} />
                ))}
              </div>
            ) : matches.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-5xl mb-4">💌</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Chưa có matches nào
                </h3>
                <p className="text-gray-500 mb-6 text-sm">
                  Like những người bạn thích để tìm match nhé!
                </p>
                <button
                  onClick={() => router.push('/browse')}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-rose-600 hover:to-pink-700 transition-all inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Khám phá ngay
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => handleSelectMatch(match)}
                    className={`
                      bg-white rounded-xl shadow-sm border p-4 cursor-pointer transition-all
                      hover:shadow-md hover:border-rose-200
                      ${selectedMatch?.id === match.id ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-100'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={match.otherUser.avatar}
                        alt={match.otherUser.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">
                            {match.otherUser.name}
                          </h3>
                          <span className={`
                            text-xs px-2 py-1 rounded-full font-medium
                            ${match.status === 'scheduled' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-amber-100 text-amber-700'}
                          `}>
                            {match.status === 'scheduled' ? '✓ Đã lên lịch' : '⏳ Chưa lên lịch'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {match.otherUser.email}
                        </p>
                      </div>
                    </div>

                    {match.scheduledDate && (
                      <div className="mt-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-800">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium">Hẹn: {match.scheduledDate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form chọn availability */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {selectedMatch ? `Chọn lịch hẹn với ${selectedMatch.otherUser.name}` : 'Chọn một match để bắt đầu'}
            </h2>

            {!selectedMatch ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                <div className="text-5xl mb-4">👈</div>
                <p className="text-sm">Chọn một match từ danh sách bên trái</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {/* Info người match */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <img
                    src={selectedMatch.otherUser.avatar}
                    alt={selectedMatch.otherUser.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedMatch.otherUser.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {selectedMatch.otherUser.email}
                    </p>
                    <span className={`
                      inline-block mt-2 text-xs px-2 py-1 rounded-full font-medium
                      ${selectedMatch.status === 'scheduled' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'}
                    `}>
                      {selectedMatch.status === 'scheduled' ? '✓ Đã lên lịch' : '⏳ Chưa lên lịch'}
                    </span>
                  </div>
                </div>

                {/* Kết quả match date */}
                {matchResult && (
                  <div className={`mb-6 rounded-lg p-4 border ${
                    matchResult.success 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                      : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
                  }`}>
                    <p className={`font-medium ${matchResult.success ? 'text-green-800' : 'text-red-800'}`}>
                      {matchResult.message}
                    </p>
                    {matchResult.date && matchResult.time && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 bg-white rounded-lg p-3 border border-green-200">
                          <div className="flex items-center gap-2 text-green-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">{matchResult.date}</span>
                          </div>
                        </div>
                        <div className="flex-1 bg-white rounded-lg p-3 border border-green-200">
                          <div className="flex items-center gap-2 text-green-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{matchResult.time}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Availability đã chọn */}
                {myAvailability && !matchResult && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-blue-800 font-medium">
                          Thời gian rảnh của bạn
                        </p>
                        <div className="mt-2 space-y-1 text-blue-700 text-sm">
                          <p className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">{myAvailability.date}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{myAvailability.startTime} - {myAvailability.endTime}</span>
                          </p>
                        </div>
                        <p className="text-blue-600 text-xs mt-3 flex items-center gap-1">
                          <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                          </svg>
                          Đang đợi {selectedMatch.otherUser.name} chọn thời gian...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form chọn thời gian */}
                {!myAvailability && !matchResult && (
                  <form onSubmit={handleSaveAvailability} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📅 Chọn ngày rảnh
                      </label>
                      <select
                        value={availabilityForm.date}
                        onChange={(e) => {
                          setAvailabilityForm({ ...availabilityForm, date: e.target.value });
                          clearError('date');
                        }}
                        className={`
                          w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition
                          ${errors.date ? 'border-red-500' : 'border-gray-300'}
                        `}
                      >
                        <option value="">-- Chọn ngày --</option>
                        {getNextThreeWeeksDates().map(({ value, label, isWeekend }) => (
                          <option key={value} value={value}>
                            {label} {isWeekend && '(Cuối tuần)'}
                          </option>
                        ))}
                      </select>
                      {errors.date && (
                        <p className="mt-1 text-xs text-red-500">{errors.date}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ⏰ Từ
                        </label>
                        <input
                          type="time"
                          value={availabilityForm.startTime}
                          onChange={(e) => {
                            setAvailabilityForm({ ...availabilityForm, startTime: e.target.value });
                            clearError('startTime');
                          }}
                          className={`
                            w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition
                            ${errors.startTime ? 'border-red-500' : 'border-gray-300'}
                          `}
                        />
                        {errors.startTime && (
                          <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ⏰ Đến
                        </label>
                        <input
                          type="time"
                          value={availabilityForm.endTime}
                          onChange={(e) => {
                            setAvailabilityForm({ ...availabilityForm, endTime: e.target.value });
                            clearError('endTime');
                          }}
                          className={`
                            w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition
                            ${errors.endTime ? 'border-red-500' : 'border-gray-300'}
                          `}
                        />
                        {errors.endTime && (
                          <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs text-amber-800">
                        💡 <strong>Mẹo:</strong> Chọn khung giờ rộng hơn để tăng khả năng tìm được lịch trùng nhau.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          Lưu thời gian rảnh
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
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
