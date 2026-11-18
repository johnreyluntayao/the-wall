import { cn } from "@/lib/utils";

export function UserAvatar({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("wall-avatar", className)}>
      <span>W<span className="avatar-spark">✳</span></span>
    </span>
  );
}
