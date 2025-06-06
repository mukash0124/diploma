"use client";
import { Toaster } from "@/components/ui/sonner";

export default function ResultsLayout({
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
