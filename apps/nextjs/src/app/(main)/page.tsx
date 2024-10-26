import Link from "next/link";

import { Button } from "@bt/ui/button";

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <h1 className="scroll-m-20 font-mono text-4xl font-extrabold tracking-tight lg:text-5xl">
        Let's learn new today
      </h1>
      <p className="w-1/3 text-wrap text-center text-xl text-muted-foreground">
        Where students collects the knowledge like bees 🐝 gathering honey 🍯
      </p>
      <Link href={"/sign-in"}>
        <Button size={"lg"}>Get Started</Button>
      </Link>
    </div>
  );
}
