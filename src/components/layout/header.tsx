"use client";

import { Menu, Search, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NuLogo } from "@/components/icons/nu-logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" aria-label="Home">
          <NuLogo />
        </Link>
        
        <div className="hidden items-center gap-2 md:flex">
          <Button>Quero ser Nubank</Button>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Pesquisar</span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Minha conta</span>
          </Button>
        </div>

        <div className="flex items-center gap-4 text-foreground md:hidden">
          <Search className="h-5 w-5" />
          <User className="h-5 w-5" />
          <Menu className="h-6 w-6" />
        </div>
      </div>
    </header>
  );
}
