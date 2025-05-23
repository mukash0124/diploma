"use server";

import { SigninFormSchema, FormState } from "@/app/lib/definitions";
import { createSession, deleteSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

export async function signin(state: FormState, formData: FormData) {
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

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
    await createSession(token);
    redirect("/workflows");
  }
}

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

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
    await createSession(token);
    console.log("Session created successfully", token);
    redirect("/workflows");
  }
}

export async function logout() {
  await deleteSession();
  redirect("/signin");
}
