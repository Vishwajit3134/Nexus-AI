"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="z-10 py-6 bg-background border-b border-border sticky top-0 backdrop-blur-sm bg-background/80">
      <div className="container flex items-center justify-end h-full px-6 mx-auto gap-4">
        <h1 className="text-2xl font-bold">NexusAI</h1>
        <h1 className="  "> </h1>
        <ThemeToggle />

        <Link href="/profile">
          <Button
            variant="outline"
            className="flex items-center gap-2 pl-4 pr-2  rounded-full rounded-[100px] px-6 py-5 hover:bg-muted transition-colors h-10"
          >
            <span className="text-sm font-medium hidden sm:block">
              My Account
            </span>
            <UserCircle className="w-6 h-6 text-muted-foreground" />
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
