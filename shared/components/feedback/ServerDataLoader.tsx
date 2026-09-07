import { ReactNode } from 'react';

interface ServerDataLoaderProps {
  children: ReactNode;
  isLoading?: boolean;
  error?: string | null;
  loadingMessage?: string;
}

/**
 * Server Data Loader Component
 * کامپوننت بارگذاری داده‌های سرور
 */
export const ServerDataLoader = ({ 
  children, 
  isLoading = false, 
  error = null,
  loadingMessage = 'در حال بارگذاری...'
}: ServerDataLoaderProps) => {
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-red-600 text-xl mb-4">❌ خطا در بارگذاری داده‌ها</div>
          <div className="text-gray-600 text-sm">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-theme-white rounded hover:bg-blue-700"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#129197] mx-auto mb-4"></div>
          <div className="text-gray-600">{loadingMessage}</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};