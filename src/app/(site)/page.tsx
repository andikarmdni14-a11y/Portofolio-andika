import { Bio } from "@/components/home/Bio";
import { CertificatesSummary } from "@/components/home/CertificatesSummary";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { ServicesSummary } from "@/components/home/ServicesSummary";

// Data proyek unggulan & sertifikat di-cache; diperbarui otomatis tiap 5 menit.
export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <CertificatesSummary />
      <ServicesSummary />
      <Bio />
    </>
  );
}
