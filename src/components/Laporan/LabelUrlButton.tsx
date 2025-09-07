"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getLabelUrl, getIdExpressLabelUrl } from "@/lib/apiClient";
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

    // Support for JNT Express and ID Express
    if (vendor !== "JNTEXPRESS" && vendor !== "IDEXPRESS") {
      toast.error("Label URL only available for JNT Express and ID Express orders");
      return;
    }

    try {
      setIsLoading(true);
      let response;

      if (vendor === "JNTEXPRESS") {
        response = await getLabelUrl(awbNo);
      } else if (vendor === "IDEXPRESS") {
        response = await getIdExpressLabelUrl(awbNo);
      }

      if (response && response.status === "success" && response.data) {
        setLabelUrl(response.data.label_url);
        toast.success("Label URL retrieved successfully!");
      } else {
        toast.error(response?.message || "Failed to get label URL");
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

  // Show for JNT Express and ID Express
  if (vendor !== "JNTEXPRESS" && vendor !== "IDEXPRESS") {
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
