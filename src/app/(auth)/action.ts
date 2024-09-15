"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { signUpSchema, SignUpSchemaType } from "@/lib/validation";
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

    const createdUser = await prisma.user.create({
      data: {
        username,
        displayName: username,
        email,
        passwordHash,
      },
    });

    console.log({ createdUser });

    const sessionId = new ObjectId();
    const session = await lucia.createSession(createdUser.id, {
      id: sessionId,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);

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
