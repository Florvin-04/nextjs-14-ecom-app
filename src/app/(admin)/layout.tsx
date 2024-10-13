import React from "react";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./_components/AdminSidebar";
import SessionProvider from "@/providers/SessionProvider";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await validateRequest();

  if (!session.user || !session.session) redirect("/login");

  if (!session.user.role.ADMIN) return <div>UnAuthorized</div>;

  return (
    <SessionProvider value={{ user: session.user, session: session.session }}>
      <div className="grid grid-cols-[200px_1fr] min-h-[100svh]">
        <div className="">
          <AdminSidebar />
        </div>
        <div className=" overflow-x-hidden">{children}</div>
      </div>
    </SessionProvider>
  );
};

export default layout;
