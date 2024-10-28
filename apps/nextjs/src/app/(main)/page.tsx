import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Search, ShellIcon, TvMinimal } from "lucide-react";

import { Button } from "@bt/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bt/ui/card";
import { Input } from "@bt/ui/input";

import { api } from "~/trpc/server";
import { CreateChannelButton } from "./create-channel";

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

async function ChannelsPage() {
  const channels = await api.channels.all();

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold">All Channels</h1>
        <p className="text-sm text-muted-foreground">
          An container which describe the course
        </p>
      </div>
      <div className="flex gap-3">
        <div className="relative flex w-full items-center">
          <Search className="absolute ml-2.5 mr-2.5 size-5 text-muted-foreground" />
          <Input placeholder="Search channel..." className="h-10 ps-10" />
        </div>
        <CreateChannelButton />
      </div>

      {channels.length === 0 && (
        <section
          aria-label="Channels Empty"
          className="flex flex-col items-center gap-3 py-40"
        >
          <TvMinimal
            className="size-20 text-muted-foreground"
            strokeWidth={1.25}
          />
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            No channels
          </h4>
          <p className="w-1/3 text-center text-sm text-muted-foreground">
            Create one by clicking on create channel and organize a space for
            your course/subject
          </p>
        </section>
      )}

      <section aria-label="Channels Grid" className="grid grid-cols-4">
        {channels.length !== 0 &&
          channels.map((channel) => (
            <Card
              key={channel.id}
              className="overflow-hidden transition-all duration-200 hover:cursor-pointer hover:bg-accent/60"
            >
              <CardContent className="flex h-44 items-center justify-center bg-primary/15">
                <ShellIcon className="size-20 text-primary" strokeWidth={1.3} />
              </CardContent>
              <CardHeader className="p-4">
                <CardTitle>{channel.title}</CardTitle>
                <CardDescription>0 chapters</CardDescription>
              </CardHeader>
            </Card>
          ))}
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <SignedIn>
        <ChannelsPage />
      </SignedIn>
      <SignedOut>
        <HomePage />
      </SignedOut>
    </>
  );
}
