"use client";

import { signup } from "../actions/auth";
import { SignUpForm } from "@/app/lib/components/auth/signup-form";
import { useActionState } from "react";

export default function SignUpPage() {
  const [, action, pending] = useActionState(signup, undefined);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm action={action} pending={pending} />
      </div>
    </div>
  );
}
