import React from "react";
import { cn } from "@/lib/utils";
import { ShippingOption } from "@/lib/shipping-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp } from "lucide-react";
import Image from "next/image";

interface ShippingCardProps {
  option: ShippingOption;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ShippingCard({
  option,
  isSelected,
  onClick,
}: ShippingCardProps) {
  return (
    <div
      className={cn(
        "shipping-card animate-fade-in flex items-center justify-between group",
        isSelected && "shipping-card-active"
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-md border overflow-hidden">
          <Image
            src={option.logo}
            alt={option.name}
            width={100} // ← kasih width
            height={100} // ← kasih height
            className="max-w-full max-h-full object-contain p-1"
          />
        </div>
        <div>
          <div className="font-medium text-sm">{option.name}</div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-purple-700 font-medium text-sm">
              {option.price}
            </span>
            {option.originalPrice && (
              <span className="text-gray-400 text-xs line-through">
                {option.originalPrice}
              </span>
            )}
          </div>
          {option.tags && option.tags.length > 0 && (
            <div className="flex gap-1 mt-1.5">
              {option.tags.map((tag, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded",
                    tag.type === "warning"
                      ? "bg-amber-50 text-amber-700"
                      : tag.type === "info"
                      ? "bg-purple-50 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {tag.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center">
        {option.recommended && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-green-50 p-1.5 rounded-full text-green-600">
                  <ThumbsUp size={16} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Rekomendasi</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Badge variant="outline" className="ml-2 bg-gray-50">
          {option.duration}
        </Badge>
      </div>
    </div>
  );
}
