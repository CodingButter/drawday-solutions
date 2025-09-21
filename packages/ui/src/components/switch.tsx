import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "../lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, checked, defaultChecked, ...props }, ref) => {
  // Track internal state for uncontrolled components
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);

  // Use checked prop if provided (controlled), otherwise use internal state (uncontrolled)
  const isChecked = checked !== undefined ? checked : internalChecked;

  const handleCheckedChange = (newChecked: boolean) => {
    // Update internal state for uncontrolled components
    if (checked === undefined) {
      setInternalChecked(newChecked);
    }
    // Call the original handler
    props.onCheckedChange?.(newChecked);
  };

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        isChecked ? "bg-drawday-navy" : "bg-gray-200 dark:bg-gray-700",
        className
      )}
      checked={checked}
      defaultChecked={defaultChecked}
      {...props}
      onCheckedChange={handleCheckedChange}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          isChecked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };