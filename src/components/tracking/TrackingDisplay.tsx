"use client";

import type { StandardizedTrackingResponse } from "@/types/tracking";
import { OrderInfoCard } from "./OrderInfoCard";
import { PackageInfoCard } from "./PackageInfoCard";
import { CostDetailsCard } from "./CostDetailsCard";
import { AddressesCard } from "./AddressesCard";
import { TrackingHistoryCard } from "./TrackingHistoryCard";
import { JntTrackingContent } from "./vendors/JntTrackingContent";
import { PaxelTrackingContent } from "./vendors/PaxelTrackingContent";
import { LionTrackingContent } from "./vendors/LionTrackingContent";
import { IdExpressTrackingContent } from "./vendors/IdExpressTrackingContent";
import { GoSendTrackingContent } from "./vendors/GoSendTrackingContent";

interface TrackingDisplayProps {
  result: StandardizedTrackingResponse;
}

export const TrackingDisplay: React.FC<TrackingDisplayProps> = ({ result }) => {
  const renderVendorSpecificContent = () => {
    switch (result.vendor.toLowerCase()) {
      case "jntexpress":
        return <JntTrackingContent data={result.tracking_data} />;
      case "paxel":
        return <PaxelTrackingContent data={result.tracking_data} />;
      case "lion":
        return <LionTrackingContent result={result} />;
      case "idexpress":
        return <IdExpressTrackingContent result={result} />;
      case "gosend":
        return <GoSendTrackingContent result={result} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <OrderInfoCard orderInfo={result.order_info} />
      <PackageInfoCard data={result.tracking_data.package_info} />
      <CostDetailsCard data={result.tracking_data.cost_details} />
      <AddressesCard data={result.tracking_data.addresses} />
      <TrackingHistoryCard data={result.tracking_data.tracking_history} />
      {renderVendorSpecificContent()}
    </div>
  );
};
