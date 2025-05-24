"use client";

import { confirm } from "../actions/auth";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function SignInPage() {
  const [result, action, pending] = useActionState(confirm, undefined);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Confirm Email</CardTitle>
              <CardDescription>
                Enter one-time code that was sent to your email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={action}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2 justify-center">
                    <InputOTP maxLength={6} name="code">
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {result && (
                    <div className="text-center text-sm text-red-500">
                      {result?.message}
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={pending}>
                    Confirm
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
