"use client";

import { UserDetails } from "@/lib/types";
import { Session } from "lucia";
import React, { createContext, useContext } from "react";

type SessionContextType = {
  user: UserDetails;
  session: Session;
};

const SessionContext = createContext<SessionContextType | null>(null);

const SessionProvider = ({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContextType }>) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export default SessionProvider;

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSessionsContext must be used inside SessionProvider");
  }

  return context;
};
