export function Watermark() {
  return (
    <aside
      aria-label="AkshHQ watermark"
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 pointer-events-auto select-none print:hidden"
    >
      <a
        href="https://github.com/akshhq"
        target="_blank"
        rel="noopener noreferrer"
        title="AkshHQ"
        className="flex items-center justify-center px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-zinc-900 shadow-md shadow-black/25 backdrop-blur-md border border-white/70 opacity-90 hover:opacity-100"
      >
        <img
          src="/images/akshhq-logo.png"
          alt="AkshHQ"
          className="h-4.5 sm:h-5.5 w-auto object-contain block"
          loading="eager"
        />
      </a>
    </aside>
  );
}
