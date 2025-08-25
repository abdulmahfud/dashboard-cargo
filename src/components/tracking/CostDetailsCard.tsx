"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CostDetails } from "@/types/tracking";

interface CostDetailsCardProps {
  data: CostDetails;
}

export const CostDetailsCard: React.FC<CostDetailsCardProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Biaya</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <label className="text-gray-600">Ongkos Kirim</label>
            <p className="font-semibold">
              {formatCurrency(data.shipping_cost)}
            </p>
          </div>
          {data.cod_value && (
            <div>
              <label className="text-gray-600">COD</label>
              <p className="font-semibold">
                {formatCurrency(data.cod_value)}
              </p>
            </div>
          )}
          {data.insurance_cost && (
            <div>
              <label className="text-gray-600">Asuransi</label>
              <p className="font-semibold">
                {formatCurrency(data.insurance_cost)}
              </p>
            </div>
          )}
          {data.total_amount && (
            <div>
              <label className="text-gray-600">Total</label>
              <p className="font-semibold text-lg">
                {formatCurrency(data.total_amount)}
              </p>
            </div>
          )}
          {data.invoice_value && (
            <div>
              <label className="text-gray-600">Nilai Invoice</label>
              <p className="font-semibold">
                {formatCurrency(data.invoice_value)}
              </p>
            </div>
          )}
          {data.payment_type && (
            <div>
              <label className="text-gray-600">Tipe Pembayaran</label>
              <p className="font-semibold">{data.payment_type}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
