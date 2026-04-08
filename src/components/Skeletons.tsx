"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function HotelCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col h-full animate-pulse">
      <div className="h-60 bg-slate-200 relative" />
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="pt-4 border-t border-slate-100 flex gap-2">
          <div className="h-6 bg-slate-200 rounded w-16" />
          <div className="h-6 bg-slate-200 rounded w-16" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="h-10 bg-slate-200 rounded-lg" />
          <div className="h-10 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function HotelsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <HotelCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HotelDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Gallery Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
          <div className="md:col-span-2 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 gap-4 md:col-span-1">
             <div className="bg-slate-200 rounded-2xl animate-pulse" />
             <div className="bg-slate-200 rounded-2xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:col-span-1">
             <div className="bg-slate-200 rounded-2xl animate-pulse" />
             <div className="bg-slate-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 space-y-8">
          <div className="space-y-4">
            <div className="h-10 bg-slate-200 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
        <div className="lg:w-1/3">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse" />
            <div className="h-12 bg-slate-200 rounded w-full animate-pulse" />
            <div className="h-48 bg-slate-200 rounded w-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
