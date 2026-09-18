"use client";

import { useTransition } from "react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

export function DeleteButton<Args extends unknown[]>({
  action,
  args,
  confirmText,
  variant = "destructive",
  size,
  className,
}: {
  action: (...args: Args) => void | Promise<void>;
  args: Args;
  confirmText: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        variant === "ghost" && "text-destructive hover:text-destructive",
        className,
      )}
      disabled={isPending}
      onClick={() => {
        if (!confirm(confirmText)) return;
        startTransition(() => action(...args));
      }}
    >
      {isPending ? "Deleting…" : "Delete"}
    </Button>
  );
}