import { Skeleton } from "@/components/ui/skeleton";

export function RouteLoadingSkeleton() {
  // Skeleton fades out naturally when Suspense replaces it
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar placeholder (desktop only) */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-[260px] border-r border-border/50 bg-card p-4 space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="md:ml-[260px] pt-14 md:pt-0">
        {/* Header placeholder */}
        <div className="h-16 border-b border-border/50 px-6 flex items-center gap-4">
          <Skeleton className="h-6 w-48" />
          <div className="ml-auto flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>

        {/* Page content placeholder */}
        <div className="p-4 md:p-6 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          {/* Table/content placeholder */}
          <Skeleton className="h-10 w-full rounded-md" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
