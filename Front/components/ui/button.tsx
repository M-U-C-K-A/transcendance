import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        hell: "bg-gradient-to-br from-red-700 via-red-900 to-yellow-900 text-white shadow-xl shadow-red-900/60 hover:from-red-800 hover:to-yellow-800 hover:shadow-yellow-700/40 ring-2 ring-red-900/30 focus-visible:ring-yellow-400/40 animate-fire transition-all duration-300",
        neon: "bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-300/50 animate-pulse-slow transition-all duration-500",
        cyber: "bg-black text-cyan-400 border-2 border-cyan-400 shadow-lg shadow-cyan-400/20 hover:bg-cyan-400/10 font-mono tracking-wider transition-all duration-200",
        matrix: "bg-black text-emerald-400 border border-emerald-400 shadow-lg shadow-emerald-400/20 hover:bg-emerald-400/10 font-mono tracking-wider transition-all duration-200",
        classic: "bg-gradient-to-br from-zinc-700 via-zinc-900 to-zinc-800 text-white shadow-xl shadow-zinc-900/60 hover:from-zinc-800 hover:to-zinc-900 hover:shadow-zinc-500/40 ring-2 ring-zinc-900/30 focus-visible:ring-zinc-200/40 animate-pulse-slow transition-all duration-300",
        arcade: "bg-yellow-400 text-black border-2 border-red-500 shadow-md hover:bg-yellow-300 font-bold tracking-wide transition-colors duration-200"

      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        full: "h-10 rounded-md px-6 w-full",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
