import { Card } from "@/components/ui/card";

export default function BookmarkCardSkeleton() {
  return (
    <Card className="p-4 flex flex-col gap-3">
      {/* Image Placeholder */}
      <div className="w-full h-40 rounded-md bg-muted animate-pulse" />

  {/* Content Placeholder */}
  <div className="flex flex-col flex-grow p-2">
    {/* Title & Favorite Icon Placeholder */}
    <div className="flex justify-between items-start mb-2">
      <div className="h-5 w-3/4 rounded-md bg-muted animate-pulse" />
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
    </div>

    {/* Description Placeholder */}
    <div className="flex-grow space-y-2 mb-2">
      <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
      <div className="h-4 w-5/6 rounded-md bg-muted animate-pulse" />
      <div className="h-4 w-2/3 rounded-md bg-muted animate-pulse" />
    </div>

    {/* Link Placeholder */}
    <div className="flex items-center mb-2">
      <div className="h-4 w-4 rounded-md bg-muted animate-pulse mr-1" />
      <div className="h-4 w-1/2 rounded-md bg-muted animate-pulse" />
    </div>

    {/* Tags Placeholder */}
    <div className="flex flex-wrap gap-1 mb-2">
      <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
      <div className="h-5 w-12 rounded-full bg-muted animate-pulse" />
      <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
      {/* Add more tag placeholders if needed */}
    </div>

    {/* Category & Date Placeholder */}
    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
      <div className="h-3 w-1/4 rounded-md bg-muted animate-pulse" />
      <div className="h-3 w-1/6 rounded-md bg-muted animate-pulse" />
    </div>
  </div>
</Card>
  );
}