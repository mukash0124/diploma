"use server";

import { createSession, deleteSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function signin(
  state:
    | {
        message: string;
      }
    | undefined,
  formData: FormData
) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const data = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
  });

  if (!data.ok) {
    const errorBody = await data.text();
    return {
      message: `An error occurred: ${errorBody}`,
    };
  }

  const responseBody = await data.json();
  const token = responseBody.token;

  if (!token) {
    return {
      message: "An error occurred while retrieving the token.",
    };
  } else {
    await createSession("session", token);
    redirect("/workflows");
  }
}

export async function signup(
  state:
    | {
        message: string;
      }
    | undefined,
  formData: FormData
) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const username = formData.get("username")?.toString();
  const confirm_password = formData.get("confirm_password")?.toString();

  if (password != confirm_password) {
    return {
      message: "Password and confirm password must be equal",
    };
  }

  const data = await fetch(
    "http://localhost:8080/api/auth/request-confirmation",
    {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
        username: username,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    }
  );

  console.log(
    JSON.stringify({
      email: email,
      password: password,
      username: username,
    })
  );

  if (!data.ok) {
    const errorBody = await data.text();
    return {
      message: `An error occurred: ${errorBody}`,
    };
  }

  await createSession("email", email || "");
  redirect("/confirm");
}

export async function confirm(
  state:
    | {
        message: string;
      }
    | undefined,
  formData: FormData
) {
  const code = formData.get("code");
  const cookieStore = await cookies();
  const cookie = cookieStore.get("email");
  if (!cookie) {
    redirect("/");
  }
  const email = cookie.value;

  const data = await fetch("http://localhost:8080/api/auth/confirm", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      confirmationCode: code,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
  });

  console.log(
    JSON.stringify({
      email: email,
      confirmationCode: code,
    })
  );

  if (!data.ok) {
    const errorBody = await data.text();
    return {
      message: `An error occurred: ${errorBody}`,
    };
  }

  redirect("/signin");
}

export async function logout() {
  await deleteSession();
  redirect("/signin");
}
