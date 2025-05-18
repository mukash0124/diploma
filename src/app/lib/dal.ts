"use server";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "./session";

export const verifySession = cache(async () => {
  const session = await getSession();

  return session;
});

export const getUser: () => Promise<
  { userId: string; email: string; username: string } | null | undefined
> = cache(async () => {
  const session = await verifySession();

  try {
    const response = await fetch("http://localhost:8080/api/token/decode", {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${session}`,
      },
    });

    if (!response.ok) {
      redirect("/signin");
    }

    return await response.json();
  } catch {
    redirect("/signin");
  }
});
