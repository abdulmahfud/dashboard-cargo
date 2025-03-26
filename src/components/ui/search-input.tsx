import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  onClear?: () => void;
  iconColor?: string; // ⬅️ Optional: biar fleksibel
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { className, icon, iconColor = "text-blue-500", ...props },
    ref
  ) => {
    return (
      <div className="relative w-full">
        <Input className={cn("pr-10", className)} ref={ref} {...props} />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          {icon || <Search size={18} className={cn(iconColor)} />}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
