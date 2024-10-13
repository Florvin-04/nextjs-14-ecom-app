import { validateRequest } from "@/auth";
import SessionProvider from "@/providers/SessionProvider";
import { redirect } from "next/navigation";
import React from "react";


const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await validateRequest();

  if (!session.user || !session.session) redirect("/login");

  return (
    <SessionProvider
      value={{
        session: session.session,
        user: session.user,
      }}
    >
      {children}
    </SessionProvider>
  );
};

export default layout;
