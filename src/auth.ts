import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "./lib/prisma";
import { Lucia, Session } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";
import { RoleType } from "@prisma/client";
import { DatabaseUserAttributes, UserDetails, UserDetailsRoleType } from "./lib/types";
// import { Google } from "arctic";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },

  getUserAttributes(DatabaseUserAttributes) {
    const { id, avatarUrl, displayName, googleId, username, role } =
      DatabaseUserAttributes;
    return {
      id,
      username,
      displayName,
      avatarUrl,
      googleId,
      role,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}



// export const google = new Google(
//   CONFIG_APP.env.GOOGLE_CLIENT_ID!,
//   CONFIG_APP.env.GOOGLE_CLIENT_SECRET!,
//   `${CONFIG_APP.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`
// );

// http://localhost:3000/api/auth/callback/google

// Function to create user roles from a string array
// function createUserRoles(roles: string[]): RoleType[] {
//   return roles.map(role => role as RoleType); // Ensure each role is cast to RoleType
// }

function createUserRole(userRole: RoleType): UserDetailsRoleType {
  // Create an object with all roles set to false
  const roles = Object.keys(RoleType).reduce((acc, role) => {
    acc[role as RoleType] = userRole === role;
    return acc;
  }, {} as Record<RoleType, boolean>);

  return roles;
}

export const validateRequest = cache(
  async (): Promise<{
    user: UserDetails | null;
    session: Session | null; // Ensure session can also be null
  }> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }

      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}

    const user: UserDetails | null = result.user
      ? {
          id: result.user.id,
          role: createUserRole(result.user.role),
          username: result.user.username,
          displayName: result.user.displayName,
          avatarUrl: result.user.avatarUrl,
          googleId: result.user.googleId,
        }
      : null;

    const sessionResult = {
      user,
      session: result.session, // Ensure session is correctly typed
    };

    console.log({ result });

    return sessionResult;
  }
);
