import * as React from "react"

import { cn } from "@/utils/index"

const Field = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("grid gap-2", className)} {...props} />
})
Field.displayName = "Field"

const FieldLabel = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
})
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FieldDescription.displayName = "FieldDescription"

export { Field, FieldLabel, FieldDescription }

