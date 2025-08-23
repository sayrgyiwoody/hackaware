import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for Chat History
export const ChatHistorySkeleton = () => (
  <div className="flex-1 overflow-y-auto px-2 space-y-4">
    {Array.from({ length: 15 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-2 rounded-md"
      >
        <Skeleton className="h-6 w-full" />
      </div>
    ))}
  </div>
);

// Skeleton for Footer
export const SidePanelFooterSkeleton = () => (
  <div className="p-4 border-t border-gray-800">
    <Skeleton className="h-10 w-full" />
  </div>
);
