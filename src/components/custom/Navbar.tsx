"use client";

import { handleLogoutAction } from "@/app/(auth)/action";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-1">
      <div>ada</div>
      <Button
        className="bg-red-500"
        onClick={() => {
          handleLogoutAction();
          console.log("logout");
        }}
      >
        Logout
      </Button>
    </div>
  );
}
