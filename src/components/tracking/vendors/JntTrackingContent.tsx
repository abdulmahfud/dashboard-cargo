"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck } from "lucide-react";
import type { StandardizedTrackingData } from "@/types/tracking";

interface JntTrackingContentProps {
  data: StandardizedTrackingData;
}

export const JntTrackingContent: React.FC<JntTrackingContentProps> = ({ data }) => {
  if (!data.driver_info) {
    return null;
  }

  return (
    <>
      {data.cost_details.cod_value && (
        <Card>
          <CardHeader>
            <CardTitle>COD Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              <strong>COD Value:</strong> {data.cost_details.cod_value}
            </p>
          </CardContent>
        </Card>
      )}

      {(data.driver_info.pickup_driver.name || data.driver_info.delivery_driver.name) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Driver Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.driver_info.pickup_driver.name && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Pickup Driver</h4>
                  <p className="text-sm">
                    <strong>Name:</strong> {data.driver_info.pickup_driver.name}
                  </p>
                  {data.driver_info.pickup_driver.phone && (
                    <p className="text-sm">
                      <strong>Phone:</strong> {data.driver_info.pickup_driver.phone}
                    </p>
                  )}
                </div>
              )}
              {data.driver_info.delivery_driver.name && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Delivery Driver</h4>
                  <p className="text-sm">
                    <strong>Name:</strong> {data.driver_info.delivery_driver.name}
                  </p>
                  {data.driver_info.delivery_driver.phone && (
                    <p className="text-sm">
                      <strong>Phone:</strong> {data.driver_info.delivery_driver.phone}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
