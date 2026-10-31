import { Bio } from "@/components/home/Bio";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { ServicesSummary } from "@/components/home/ServicesSummary";

// Data proyek unggulan di-cache; diperbarui otomatis tiap 5 menit.
export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <ServicesSummary />
      <Bio />
    </>
  );
}
