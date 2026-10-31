import { ImageReveal } from "@/components/motion/ImageReveal";

/** Screenshot di dalam frame laptop digital. Rasio layar tetap (16:10) agar tanpa layout shift. */
export function LaptopMockup({
  src,
  alt,
  placeholder,
}: {
  src: string | null;
  alt: string;
  placeholder: string;
}) {
  return (
    <figure>
      <div className="border border-border bg-surface p-2 md:p-3">
        <ImageReveal className="aspect-[16/10] border border-border bg-background">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} loading="lazy" className="size-full object-cover object-top" />
          ) : (
            <div className="grid size-full place-items-center p-6 text-center">
              <p className="text-sm text-muted">{placeholder}</p>
            </div>
          )}
        </ImageReveal>
      </div>
      {/* Alas laptop */}
      <div
        aria-hidden="true"
        className="relative left-1/2 h-2.5 w-[104%] -translate-x-1/2 border border-t-0 border-border bg-surface"
      />
    </figure>
  );
}
