import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

import { Button } from "@bt/ui/button";

import { ChannelsListClient } from "./channels-list";
import { CreateChannelButton } from "./create-channel";
import SearchChannel from "./search-channel";

export function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <h1 className="scroll-m-20 font-mono text-4xl font-extrabold tracking-tight lg:text-5xl">
        Let's learn new today user
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

export default function Page() {
  return (
    <>
      <SignedIn>
        <div className="flex flex-col gap-4 px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold">All Channels</h1>
            <p className="text-sm text-muted-foreground">
              An container which describe the course
            </p>
          </div>
          <div className="flex gap-3">
            <SearchChannel />
            <CreateChannelButton />
          </div>
          <ChannelsListClient />
        </div>
      </SignedIn>
      <SignedOut>
        <HomePage />
      </SignedOut>
    </>
  );
}
