import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoaderStore } from "@/store/loaderStore";

export function Loader({ className }: { className?: string }) {
  const loading = useLoaderStore((state) => state.loading);
  if (!loading) return null;
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
