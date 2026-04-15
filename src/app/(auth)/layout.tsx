import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 min-h-[calc(100vh-120px)]">
        {children}
      </main>
      <Footer />
    </>
  );
}
