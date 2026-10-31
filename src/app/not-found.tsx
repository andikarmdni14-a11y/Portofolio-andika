import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container">
        <p className="font-display text-[clamp(6rem,22vw,18rem)] leading-[0.8] text-accent">
          404
        </p>
        <h1 className="mt-6 font-display text-4xl uppercase md:text-5xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-4 max-w-md text-muted">
          Halaman yang Anda cari tidak ada atau belum tersedia.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-none bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          Kembali ke Home
        </Link>
      </div>
    </section>
  );
}
