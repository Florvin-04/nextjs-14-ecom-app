import Image from "next/image";
import imagePlaceHolder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";

type Props = {
  avatarUrl?: string;
  className?: string;
};

export default function UserAvatar({ avatarUrl, className }: Props) {
  return (
    <Image
      className={cn(
        "size-full aspect-square object-cover rounded-[inherit]",
        className
      )}
      src={avatarUrl || imagePlaceHolder}
      alt="user avatar"
      width={100}
      height={100}
    />
  );
}
