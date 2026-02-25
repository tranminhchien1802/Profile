'use client';

export function ProfileCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="bg-gradient-to-r from-pink-400 to-red-400 h-32" />
      <div className="px-6 pb-6">
        <div className="relative -mt-16 mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-white mx-auto bg-gray-300" />
        </div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2" />
        <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto mb-4" />
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 rounded w-5/6" />
        </div>
        <div className="h-10 bg-gray-300 rounded-lg" />
      </div>
    </div>
  );
}

export function MatchCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-300" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="h-8 bg-gray-300 rounded w-48 animate-pulse" />
        </div>
      </div>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProfileCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
