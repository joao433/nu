"use client";

import { Menu, Search, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex h-full flex-col">
                <div className="p-6">
                  <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                    <NuLogo />
                  </Link>
                </div>
                <nav className="grid gap-4 p-6 text-lg font-medium">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Search className="h-5 w-5" />
                    <span>Pesquisar</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <User className="h-5 w-5" />
                    <span>Minha conta</span>
                  </div>
                </nav>
                <div className="mt-auto p-6">
                  <Button className="w-full">Quero ser Nubank</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
