import React from "react";
import { UserButton } from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "@bt/ui/avatar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen w-screen overflow-y-auto">
      <header className="sticky top-0 z-[9999] flex h-16 items-center justify-between border-b bg-secondary/25 px-6 backdrop-blur-xl">
        <h4 className="font-mono text-xl font-semibold">🐝BeeTopic</h4>
        <UserButton />
      </header>
      {children}
    </main>
  );
}
