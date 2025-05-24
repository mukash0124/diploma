"use client";

import { signin } from "../actions/auth";
import { SignInForm } from "@/app/lib/components/auth/signin-form";
import { useActionState } from "react";

export default function SignInPage() {
  const [result, action, pending] = useActionState(signin, undefined);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm result={result} action={action} pending={pending} />
      </div>
    </div>
  );
}
