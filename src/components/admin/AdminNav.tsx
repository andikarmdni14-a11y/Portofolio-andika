"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();
  const items = [
    { href: "/admin/projects", label: "Proyek" },
    { href: "/admin/certificates", label: "Sertifikat" },
    { href: "/admin/messages", label: unread > 0 ? `Pesan (${unread})` : "Pesan" },
  ];

  return (
    <nav aria-label="Navigasi admin">
      <ul className="flex gap-6">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`block border-b-2 py-1 text-sm font-medium transition-colors hover:text-foreground ${
                  active ? "border-accent text-foreground" : "border-transparent text-muted"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
