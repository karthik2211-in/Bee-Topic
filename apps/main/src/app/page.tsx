import Image from "next/image";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <Image
          src="/beetopic-icon.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h3 className="scroll-m-20 text-center font-mono text-2xl font-semibold tracking-tight text-foreground/80 sm:text-left">
          Collect, Grow, Thrive.
        </h3>
        <p className="text-center text-xl font-normal tracking-wider text-muted-foreground sm:text-left">
          Where Every Bee Gathers Sweet Knowledge.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            className="flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/download.png"
              alt="Vercel logomark"
              width={24}
              height={24}
            />
            Download APK
          </a>
          <a
            className="flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms & Conditions
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6">
        <div className="space-y-2 text-center">
          <p className="text-sm text-muted-foreground"> Powered by</p>
          <Image
            src="/jbportals.svg"
            alt="JB Portals logomark"
            width={120}
            height={200}
          />
        </div>
      </footer>
    </div>
  );
}
