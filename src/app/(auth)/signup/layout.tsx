import { Toaster } from "@/components/ui/sonner";

export default function SignInLayout({
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
