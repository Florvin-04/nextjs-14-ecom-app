"use server";

import { lucia, validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {
  loginSchema,
  LoginSchemaType,
  signUpSchema,
  SignUpSchemaType,
} from "@/lib/validation";
import argon2 from "argon2";
// import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ObjectId } from "mongodb";

export const handleSignUpAction = async (
  credentials: SignUpSchemaType
): Promise<{ error: string }> => {
  try {
    const { email, password, username } = signUpSchema.parse(credentials);

    // const userId = generateIdFromEntropySize(10);

    const passwordHash = await argon2.hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      // outputLen: 32,
      parallelism: 1,
    });

    console.log({ passwordHash });

    const isUsernameExist = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (isUsernameExist) {
      return {
        error: "Username already Exist",
      };
    }

    const isEmailExist = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    console.log({ isEmailExist });

    if (isEmailExist) {
      return {
        error: "Email already Exist",
      };
    }

    const asd = await prisma.user.findFirst({
      where: {
        googleId: null,
      },
    });

    console.log({ asd });

    const createdUser = await prisma.user.create({
      data: {
        username,
        displayName: username,
        email,
        passwordHash,
        googleId: null,
      },
    });

    console.log({ createdUser });

    const sessionId = new ObjectId().toString();
    console.log({ sessionId });
    const session = await lucia.createSession(createdUser.id, {
      id: sessionId,
    });
    session.id = sessionId;

    const sessionCookie = lucia.createSessionCookie(session.id);

    console.log({ session, sessionCookie, sessionId });

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect("/");
  } catch (error) {
    console.log({ error });
    if (isRedirectError(error)) throw error;

    return {
      error: "Something went wrong",
    };
  }
};

export const handleLoginAction = async (
  credentials: LoginSchemaType
): Promise<{ error: string }> => {
  try {
    const { password, username } = loginSchema.parse(credentials);

    const usernameExist = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!usernameExist || !usernameExist.passwordHash) {
      return {
        error: "Invalid username or password",
      };
    }

    const isValidPassword = await argon2.verify(
      usernameExist.passwordHash,
      password
    );

    // const isValidPassword = await verify(usernameExist.passwordHash, password, {
    //   memoryCost: 19456,
    //   timeCost: 2,
    //   outputLen: 32,
    //   parallelism: 1,
    // });

    if (!isValidPassword) {
      return {
        error: "Invalid username or password",
      };
    }

    const sessionDuration = 24 * 60 * 60 * 1000; // sec

    const sessionId = new ObjectId().toString();

    const session = await lucia.createSession(usernameExist.id, {
      id: sessionId,
    });
    session.id = sessionId;

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(sessionCookie.name, sessionCookie.value, {
      ...sessionCookie.attributes,
      maxAge: sessionDuration,
    });

    return redirect("/");
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) throw error;

    return {
      error: "Something went wrong",
    };
  }
};

export const handleLogoutAction = async () => {
  const { session } = await validateRequest();

  if (!session) {
    throw new Error("Unauthentorized");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect("/login");
};
