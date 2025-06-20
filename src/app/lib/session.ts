"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function createSession(key: string, token: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();

  cookieStore.set(key, token, {
    httpOnly: true,
    secure: false,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/signin");
  }

  return session.value;
}
