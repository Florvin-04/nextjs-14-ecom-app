import React from "react";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./_components/AdminSidebar";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = await validateRequest();

  if (!user) return redirect("/login");

  console.log({ user });

  if (!user.role.ADMIN) return <div>UnAuthorized</div>;

  return (
    <div className="grid grid-cols-[200px_1fr] min-h-[100svh]">
      <div className="">
        <AdminSidebar />
      </div>
      <div className=" overflow-x-hidden">{children}</div>
    </div>
  );
};

export default layout;
