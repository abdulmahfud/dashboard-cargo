import { Badge } from "@/components/ui/badge";
import { Percent, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiscountBadgeProps {
  discountType: "percentage" | "fixed_amount";
  discountValue: number;
  discountAmount: number;
  className?: string;
  showAmount?: boolean;
}

export function DiscountBadge({
  discountType,
  discountValue,
  discountAmount,
  className,
  showAmount = true,
}: DiscountBadgeProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDiscountText = () => {
    if (discountType === "percentage") {
      return `${discountValue}%`;
    } else {
      return formatCurrency(discountValue);
    }
  };

  const getIcon = () => {
    return discountType === "percentage" ? (
      <Percent className="h-3 w-3" />
    ) : (
      <Minus className="h-3 w-3" />
    );
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1"
      >
        {getIcon()}-{getDiscountText()}
      </Badge>
      {showAmount && discountAmount > 0 && (
        <span className="text-sm text-green-600 font-medium">
          Hemat {formatCurrency(discountAmount)}
        </span>
      )}
    </div>
  );
}
