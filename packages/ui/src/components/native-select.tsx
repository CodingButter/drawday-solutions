/**
 * Native Select UI Component
 *
 * Purpose: Native HTML select dropdown component with consistent styling
 * across the application. Uses standard HTML select element for better
 * accessibility and familiar user experience.
 */

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full appearance-none items-center justify-between rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
      </div>
    );
  }
);
Select.displayName = "Select";

export interface SelectOptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}

const SelectOption = React.forwardRef<HTMLOptionElement, SelectOptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <option
        ref={ref}
        className={cn("py-1.5 px-2", className)}
        {...props}
      >
        {children}
      </option>
    );
  }
);
SelectOption.displayName = "SelectOption";

// For backward compatibility, export components that map to native elements
export {
  Select as NativeSelect,
  SelectOption as NativeSelectOption,
};

// Default exports for easier migration
export default Select;