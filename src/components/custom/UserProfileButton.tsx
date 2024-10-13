"use client";

import { useSession } from "@/providers/SessionProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import EditProfileModal from "./EditProfileModal";
import { useState } from "react";

export default function UserProfileButton() {
  const { user } = useSession();

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="size-[2rem] rounded-full">
          <UserAvatar avatarUrl={user.avatarUrl!} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsEditProfileModalOpen(true);
            }}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditProfileModalOpen && (
        <EditProfileModal
          onCloseModal={() => {
            setIsEditProfileModalOpen(false);
          }}
          initialValues={user}
        />
      )}
    </>
  );
}
