import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CertificateForm } from "@/components/admin/CertificateForm";
import { CERTIFICATE_BUCKET } from "@/lib/certificate-shared";
import { getAdminContext } from "@/lib/supabase/admin-auth";

export const metadata: Metadata = { title: "Edit sertifikat" };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();

  const ctx = await getAdminContext();
  if (ctx.status !== "admin") redirect("/admin/login");

  const { data } = await ctx.supabase
    .from("certificates")
    .select("id, title, issuer, year, file_type, file_path")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const url = ctx.supabase.storage.from(CERTIFICATE_BUCKET).getPublicUrl(data.file_path as string).data.publicUrl;

  return (
    <div className="space-y-8">
      <h1 className="font-display text-5xl uppercase leading-none">Edit: {data.title as string}</h1>
      <CertificateForm
        id={data.id as string}
        initialValues={{ title: data.title as string, issuer: data.issuer as string, year: String(data.year) }}
        currentFile={{ url, type: data.file_type as "image" | "pdf" }}
      />
    </div>
  );
}
