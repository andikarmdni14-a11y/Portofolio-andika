import type { Metadata } from "next";
import { CertificateForm } from "@/components/admin/CertificateForm";
import { EMPTY_CERTIFICATE_VALUES } from "@/lib/certificate-shared";

export const metadata: Metadata = { title: "Sertifikat baru" };

export default function NewCertificatePage() {
  return (
    <div className="space-y-8">
      <h1 className="font-display text-5xl uppercase leading-none">Sertifikat baru</h1>
      <CertificateForm initialValues={EMPTY_CERTIFICATE_VALUES} />
    </div>
  );
}
