import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { PageTransition } from "@/components/motion/PageTransition";
import { SplashScreen } from "@/components/motion/SplashScreen";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* overflow-x-clip (bukan hidden): mencegah scroll horizontal dari animasi
          tanpa merusak position: sticky pada Header. */}
      <div className="relative flex min-h-dvh flex-col overflow-x-clip">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <PageTransition />
      <SplashScreen />
      <CustomCursor />
    </>
  );
}
