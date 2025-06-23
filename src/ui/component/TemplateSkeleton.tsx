import React from "react";

interface TemplateSkeletonProps {
  className: string;
}

const TemplateSkeleton: React.FC<TemplateSkeletonProps> = ({ className }) => {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div
        className={`absolute inset-0 z-10 top-0 left-0 w-full h-full ${className} `}
      >
        <div
          className={`w-full h-full bg-gray-100 relative overflow-hidden rounded-t-xl `}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>

          {/* Header/Navigation skeleton */}
          <div className="bg-white h-16 flex items-center px-8">
            <div className="h-6 w-20 bg-gray-300 rounded animate-pulse"></div>
            <div className="ml-auto flex items-center space-x-6">
              <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-14 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-10 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-9 w-24 bg-gray-400 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Hero section skeleton */}
          <div className="bg-gray-50 h-80 flex items-center px-8">
            <div className="flex-1">
              <div className="h-10 w-80 bg-gray-300 rounded mb-2 animate-pulse"></div>
              <div className="h-10 w-72 bg-gray-300 rounded mb-2 animate-pulse"></div>
              <div className="h-10 w-64 bg-gray-300 rounded mb-4 animate-pulse"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 w-96 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-80 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-88 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="h-10 w-28 bg-gray-400 rounded animate-pulse"></div>
            </div>
            <div className="flex-1 flex justify-end">
              <div className="w-80 h-60 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Content section skeleton */}
          <div className="bg-white px-8 py-12">
            <div className="flex items-start space-x-8">
              <div className="w-48 h-36 bg-gray-300 rounded animate-pulse"></div>
              <div className="flex-1">
                <div className="h-7 w-64 bg-gray-300 rounded mb-2 animate-pulse"></div>
                <div className="h-5 w-48 bg-gray-300 rounded mb-3 animate-pulse"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-4/5 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="h-9 w-24 bg-gray-400 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Bottom section skeleton */}
          <div className="bg-gray-50 px-8 py-16">
            <div className="grid grid-cols-3 gap-8">
              <div className="h-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-24 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplateSkeleton;
