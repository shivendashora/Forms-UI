import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border border-gray-300 h-9 w-full min-w-0 rounded-md bg-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
        "focus-visible:border-blue-700 focus-visible:ring-0",
        className
      )}
      {...props}
    />
  )
}


export { Input }
