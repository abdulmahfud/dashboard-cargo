"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getLabelUrl } from "@/lib/apiClient";
import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";

interface LabelUrlButtonProps {
  awbNo: string;
  vendor: string;
  className?: string;
}

export function LabelUrlButton({
  awbNo,
  vendor,
  className,
}: LabelUrlButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [labelUrl, setLabelUrl] = useState<string>("");

  const handleGetLabelUrl = async () => {
    if (!awbNo) {
      toast.error("AWB number not found");
      return;
    }

    // Only show for JNT Express orders
    if (vendor !== "JNTEXPRESS") {
      toast.error("Label URL only available for JNT Express orders");
      return;
    }

    try {
      setIsLoading(true);
      const response = await getLabelUrl(awbNo);

      if (response.status === "success" && response.data) {
        setLabelUrl(response.data.label_url);
        toast.success("Label URL retrieved successfully!");
      } else {
        toast.error(response.message || "Failed to get label URL");
      }
    } catch (error) {
      console.error("Error getting label URL:", error);
      toast.error("Failed to get label URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintLabel = () => {
    if (labelUrl) {
      window.open(labelUrl, "_blank");
    } else {
      toast.error("Please get label URL first");
    }
  };

  // Only show for JNT Express
  if (vendor !== "JNTEXPRESS") {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        onClick={handleGetLabelUrl}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 mr-2" />
            Get Label URL
          </>
        )}
      </Button>

      {labelUrl && (
        <div className="space-y-2">
          <Button
            onClick={handlePrintLabel}
            variant="outline"
            size="sm"
            className="w-full"
          >
            🖨️ Print Label
          </Button>
        </div>
      )}
    </div>
  );
}
