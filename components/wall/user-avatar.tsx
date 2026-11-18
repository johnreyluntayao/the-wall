import { cn } from "@/lib/utils";
import { Image } from "@/lib/imports";
import { profile } from "@/lib/profile";

/** The assessment uses one fixed display identity for all anonymous posts. */
export function UserAvatar({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("wall-avatar", className)}>
    <Image src={profile.photo} alt="" width={44} height={44} className="avatar-photo" />
  </span>;
}
