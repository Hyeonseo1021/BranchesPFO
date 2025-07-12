import React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={`w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 ${className}`}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";
