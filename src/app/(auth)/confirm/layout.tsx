import { Toaster } from "@/components/ui/sonner";

export default function ConfirmLayout({
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
