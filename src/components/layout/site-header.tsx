"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Applications" },
  { href: "/overview", label: "Overview" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/applications");
  }
  return pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-6 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight text-foreground"
        >
          <span
            aria-hidden="true"
            className="size-2 rounded-sm bg-emerald-500"
          />
          JobFlow
        </Link>

        <div className="h-4 w-px bg-border" aria-hidden="true" />

        <nav className="flex items-center gap-1 text-sm">
          {links.map((link) => {
            const active = isActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-2.5 py-1 transition-colors",
                  active
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto">
          <Button render={<Link href="/applications/new" />} size="sm">
            <PlusIcon data-icon="inline-start" />
            New Application
          </Button>
        </div>
      </div>
    </header>
  );
}