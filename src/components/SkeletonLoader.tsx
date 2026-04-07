import React from "react";

interface SkeletonLoaderProps {
  count?: number;
  variant?: "card" | "row" | "heading";
  className?: string;
}

export const SkeletonDealCard = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
    {/* Badges placeholder */}
    <div className="absolute top-3 left-3 flex gap-2">
      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
    </div>
    
    {/* Logo + Company */}
    <div className="flex items-center gap-3 mb-3 pt-6">
      <div className="w-11 h-11 bg-gray-200 rounded-xl shrink-0"></div>
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    {/* Description */}
    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>

    {/* Deal text */}
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4 mt-2"></div>

    {/* Savings */}
    <div className="pt-2 border-t border-gray-100 mt-auto">
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

export const SkeletonDetailPage = () => (
  <div className="min-h-screen bg-background">
    <div className="container-wide py-20">
      <div className="grid lg:grid-cols-3 gap-10 animate-pulse">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Brand logos skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl bg-secondary"></div>
            <span className="text-2xl text-muted-foreground">&</span>
            <div className="w-14 h-14 rounded-xl bg-secondary"></div>
          </div>

          {/* Title skeleton */}
          <div className="h-12 bg-secondary rounded w-4/5 mb-4"></div>

          {/* Tagline skeleton */}
          <div className="h-6 bg-secondary rounded w-3/4 mb-6"></div>

          {/* Description skeleton */}
          <div className="space-y-2 mb-8">
            <div className="h-4 bg-secondary rounded w-full"></div>
            <div className="h-4 bg-secondary rounded w-5/6"></div>
          </div>

          {/* Stats skeleton */}
          <div className="h-4 bg-secondary rounded w-1/3 mb-8"></div>

          {/* Testimonial skeleton */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="h-4 bg-secondary rounded w-4/5 mb-4"></div>
            <div className="space-y-2 mb-6">
              <div className="h-3 bg-secondary rounded w-full"></div>
              <div className="h-3 bg-secondary rounded w-5/6"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary"></div>
              <div className="space-y-1">
                <div className="h-3 bg-secondary rounded w-24"></div>
                <div className="h-2 bg-secondary rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card border border-border rounded-2xl p-6">
            <div className="h-12 bg-secondary rounded mb-4"></div>
            <div className="h-6 bg-secondary rounded w-2/3 mb-6"></div>
            <div className="h-12 bg-secondary rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  count = 9, 
  variant = "card",
  className = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
}) => {
  if (variant === "card") {
    return (
      <div className={`grid gap-4 ${className}`}>
        {[...Array(count)].map((_, i) => (
          <SkeletonDealCard key={i} />
        ))}
      </div>
    );
  }

  if (variant === "row") {
    return (
      <div className="space-y-3">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse flex gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;