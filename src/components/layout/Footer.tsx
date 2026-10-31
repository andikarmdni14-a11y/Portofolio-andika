import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container flex flex-col gap-2 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <p>{siteConfig.role}</p>
      </div>
    </footer>
  );
}
