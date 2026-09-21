"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, ClipboardList, LayoutDashboard, Menu, PlusIcon, X } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Applications", icon: Briefcase },
  { href: "/overview", label: "Insights", icon: LayoutDashboard },
  { href: "/tasks", label: "Daily Tasks", icon: ClipboardList },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/applications");
  }
  return pathname.startsWith(href);
}

function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight text-sidebar-foreground"
    >
      <span aria-hidden="true" className="size-2 rounded-sm bg-emerald-500" />
      JobFlow
    </Link>
  );
}

function NewApplicationButton() {
  return (
    <Button render={<Link href="/applications/new" />} className="w-full">
      <PlusIcon data-icon="inline-start" />
      New Application
    </Button>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navLinks.map((link) => {
        const active = isActive(link.href, pathname);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppSidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background px-4 lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </Button>
        <Brand />
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col gap-6 border-r bg-sidebar px-4 py-5 shadow-xl">
            <div className="flex items-center justify-between">
              <Brand />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </div>
            <NewApplicationButton />
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <aside
        className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-6 border-r bg-sidebar px-4 py-5 lg:flex"
        aria-label="Sidebar navigation"
      >
        <Brand />
        <NewApplicationButton />
        <SidebarNav />
      </aside>
    </>
  );
}