// components/layout.tsx
"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-blue-600 dark:text-blue-400"
        >
          Chat App
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium dark:text-white">
                {session.user?.name}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session.user?.image || ""}
                  alt={session.user?.name || ""}
                />
                <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};
