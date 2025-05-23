"use client";

import { Toaster } from "@/components/ui/sonner";

export default function WorkflowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Toaster />
      {children}
    </section>
  );
}
