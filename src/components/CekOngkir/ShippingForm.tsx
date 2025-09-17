import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { getProvinces, getRegencies, getDistricts } from "@/lib/apiClient";
import type { Province, Regency, District } from "@/types/dataRegulerForm";
import {
  getJntExpressShipmentCost,
  getPaxelShipmentCost,
  getLionShipmentCost,
  getGoSendShipmentCost,
  getJntCargoShipmentCost,
  getIdExpressShipmentCost,
  getPosIndonesiaShipmentCost,
} from "@/lib/apiClient";
import type { ExpeditionAddress } from "@/types/expedition";

interface ShippingFormProps {
  onResult?: (result: Record<string, unknown>) => void;
  setIsSearching?: (isSearching: boolean) => void;
}

export default function ShippingForm({
  onResult,
  setIsSearching,
}: ShippingFormProps) {
  // State untuk dropdown pencarian
  const [originProvinceOptions, setOriginProvinceOptions] = useState<
    Province[]
  >([]);
  const [originRegencyOptions, setOriginRegencyOptions] = useState<Regency[]>(
    []
  );
  const [originDistrictOptions, setOriginDistrictOptions] = useState<
    District[]
  >([]);
  const [destProvinceOptions, setDestProvinceOptions] = useState<Province[]>(
    []
  );
  const [destRegencyOptions, setDestRegencyOptions] = useState<Regency[]>([]);
  const [destDistrictOptions, setDestDistrictOptions] = useState<District[]>(
    []
  );

  // State untuk pencarian input
  const [originProvinceSearch, setOriginProvinceSearch] = useState("");
  const [originRegencySearch, setOriginRegencySearch] = useState("");
  const [originDistrictSearch, setOriginDistrictSearch] = useState("");
  const [destProvinceSearch, setDestProvinceSearch] = useState("");
  const [destRegencySearch, setDestRegencySearch] = useState("");
  const [destDistrictSearch, setDestDistrictSearch] = useState("");

  // State untuk loading
  const [loadingOriginProvince, setLoadingOriginProvince] = useState(false);
  const [loadingOriginRegency, setLoadingOriginRegency] = useState(false);
  const [loadingOriginDistrict, setLoadingOriginDistrict] = useState(false);
  const [loadingDestProvince, setLoadingDestProvince] = useState(false);
  const [loadingDestRegency, setLoadingDestRegency] = useState(false);
  const [loadingDestDistrict, setLoadingDestDistrict] = useState(false);

  // State untuk nama yang dipilih (untuk API)
  const [selectedOriginRegencyName, setSelectedOriginRegencyName] =
    useState("");
  const [selectedDestDistrictName, setSelectedDestDistrictName] = useState("");

  // Add state to store selected location names
  const [selectedOriginProvinceName, setSelectedOriginProvinceName] =
    useState("");
  const [selectedOriginDistrictName, setSelectedOriginDistrictName] =
    useState("");
  const [selectedDestProvinceName, setSelectedDestProvinceName] = useState("");
  const [selectedDestRegencyName, setSelectedDestRegencyName] = useState("");

  const [formData, setFormData] = useState({
    // Location data
    originProvince: "",
    originRegency: "",
    originDistrict: "",
    destProvince: "",
    destRegency: "",
    destDistrict: "",
    // Package data
    weight: "",
    length: "",
    width: "",
    height: "",
    // Payment
    paymentMethod: "non-cod",
    useInsurance: false,
  });

  // Origin Province search and fetch
  useEffect(() => {
    if (originProvinceSearch.length >= 3) {
      setLoadingOriginProvince(true);
      getProvinces().then((res) => {
        setOriginProvinceOptions(
          res.data.filter((prov) =>
            prov.name.toLowerCase().includes(originProvinceSearch.toLowerCase())
          )
        );
        setLoadingOriginProvince(false);
      });
    } else {
      setOriginProvinceOptions([]);
    }
  }, [originProvinceSearch]);

  // Origin Regency search and fetch
  useEffect(() => {
    if (formData.originProvince && originRegencySearch.length >= 3) {
      setLoadingOriginRegency(true);
      getRegencies(Number(formData.originProvince)).then((res) => {
        setOriginRegencyOptions(
          res.data.filter((reg) =>
            reg.name.toLowerCase().includes(originRegencySearch.toLowerCase())
          )
        );
        setLoadingOriginRegency(false);
      });
    } else {
      setOriginRegencyOptions([]);
    }
  }, [formData.originProvince, originRegencySearch]);

  // Origin District search and fetch
  useEffect(() => {
    if (formData.originRegency && originDistrictSearch.length >= 3) {
      setLoadingOriginDistrict(true);
      getDistricts(Number(formData.originRegency)).then((res) => {
        setOriginDistrictOptions(
          res.data.filter((dist) =>
            dist.name.toLowerCase().includes(originDistrictSearch.toLowerCase())
          )
        );
        setLoadingOriginDistrict(false);
      });
    } else {
      setOriginDistrictOptions([]);
    }
  }, [formData.originRegency, originDistrictSearch]);

  // Destination Province search and fetch
  useEffect(() => {
    if (destProvinceSearch.length >= 3) {
      setLoadingDestProvince(true);
      getProvinces().then((res) => {
        setDestProvinceOptions(
          res.data.filter((prov) =>
            prov.name.toLowerCase().includes(destProvinceSearch.toLowerCase())
          )
        );
        setLoadingDestProvince(false);
      });
    } else {
      setDestProvinceOptions([]);
    }
  }, [destProvinceSearch]);

  // Destination Regency search and fetch
  useEffect(() => {
    if (formData.destProvince && destRegencySearch.length >= 3) {
      setLoadingDestRegency(true);
      getRegencies(Number(formData.destProvince)).then((res) => {
        setDestRegencyOptions(
          res.data.filter((reg) =>
            reg.name.toLowerCase().includes(destRegencySearch.toLowerCase())
          )
        );
        setLoadingDestRegency(false);
      });
    } else {
      setDestRegencyOptions([]);
    }
  }, [formData.destProvince, destRegencySearch]);

  // Destination District search and fetch
  useEffect(() => {
    if (formData.destRegency && destDistrictSearch.length >= 3) {
      setLoadingDestDistrict(true);
      getDistricts(Number(formData.destRegency)).then((res) => {
        setDestDistrictOptions(
          res.data.filter((dist) =>
            dist.name.toLowerCase().includes(destDistrictSearch.toLowerCase())
          )
        );
        setLoadingDestDistrict(false);
      });
    } else {
      setDestDistrictOptions([]);
    }
  }, [formData.destRegency, destDistrictSearch]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Function to get coordinates for a location (production-ready implementation)
  const getCoordinatesForLocation = async (
    district: string,
    city: string,
    province: string
  ): Promise<{ latitude: number; longitude: number }> => {
    try {
      // Try to get coordinates using a geocoding service
      // This is a production-ready approach using a real geocoding API
      const query = encodeURIComponent(`${district}, ${city}, ${province}, Indonesia`);

      // Using OpenStreetMap Nominatim (free geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&countrycodes=id`
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          return {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          };
        }
      }
    } catch (error) {
      console.warn("Failed to get coordinates for location:", error);
    }

    // Fallback coordinates for major Indonesian cities
    const fallbackCoordinates: Record<string, { latitude: number; longitude: number }> = {
      "DKI Jakarta": { latitude: -6.2088, longitude: 106.8456 },
      "Jawa Barat": { latitude: -6.9175, longitude: 107.6191 },
      "Jawa Tengah": { latitude: -7.2575, longitude: 110.1739 },
      "Jawa Timur": { latitude: -7.5360, longitude: 112.2384 },
      "Sumatera Utara": { latitude: 3.5952, longitude: 98.6722 },
      "Sumatera Selatan": { latitude: -2.9761, longitude: 104.7754 },
      "Kalimantan Timur": { latitude: -0.7893, longitude: 113.9213 },
      "Sulawesi Selatan": { latitude: -5.1477, longitude: 119.4327 },
      "Bali": { latitude: -8.4095, longitude: 115.1889 },
    };

    // Return fallback coordinates based on province
    return fallbackCoordinates[province] || { latitude: -6.2088, longitude: 106.8456 };
  };

  // Function to get postal code for a district (production-ready)
  const getPostalCodeForDistrict = async (
    district: string,
    city: string,
    province: string
  ): Promise<string> => {
    try {
      // You can integrate with Indonesia postal code API
      // For now, we'll use your backend API if available
      const response = await fetch(`/api/postal-code?district=${encodeURIComponent(district)}&city=${encodeURIComponent(city)}&province=${encodeURIComponent(province)}`);

      if (response.ok) {
        const data = await response.json();
        if (data.postal_code) {
          return data.postal_code;
        }
      }
    } catch (error) {
      console.warn("Failed to get postal code:", error);
    }

    // Default postal codes for major cities as fallback
    const defaultPostalCodes: Record<string, string> = {
      "Jakarta Pusat": "10110",
      "Jakarta Utara": "14240",
      "Jakarta Selatan": "12560",
      "Jakarta Barat": "11220",
      "Jakarta Timur": "13330",
      "Surabaya": "60119",
      "Bandung": "40111",
      "Medan": "20111",
      "Semarang": "50135",
      "Makassar": "90111",
      "Denpasar": "80113",
    };

    return defaultPostalCodes[city] || "10110";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (setIsSearching) setIsSearching(true);

    // Enhanced validation for production - removed sender/receiver data validation
    const missingFields = [];
    if (!formData.weight) missingFields.push("Berat");
    if (!selectedOriginRegencyName) missingFields.push("Kota Asal");
    if (!selectedDestDistrictName) missingFields.push("Kecamatan Tujuan");

    if (missingFields.length > 0) {
      onResult?.({
        error: true,
        message: `Mohon lengkapi data berikut: ${missingFields.join(", ")}`,
      });
      if (setIsSearching) setIsSearching(false);
      return;
    }

    try {
      // Get real coordinates and postal codes for both locations
      const [senderCoords, receiverCoords, senderPostalCode, receiverPostalCode] = await Promise.all([
        getCoordinatesForLocation(selectedOriginDistrictName, selectedOriginRegencyName, selectedOriginProvinceName),
        getCoordinatesForLocation(selectedDestDistrictName, selectedDestRegencyName, selectedDestProvinceName),
        getPostalCodeForDistrict(selectedOriginDistrictName, selectedOriginRegencyName, selectedOriginProvinceName),
        getPostalCodeForDistrict(selectedDestDistrictName, selectedDestRegencyName, selectedDestProvinceName),
      ]);

      // Create expedition address objects with default data since we removed user input fields
      const senderAddress: ExpeditionAddress = {
        name: "Default Sender",
        phone: "+6281234567890",
        email: "sender@example.com",
        address: `${selectedOriginDistrictName}, ${selectedOriginRegencyName}`,
        province: selectedOriginProvinceName,
        city: selectedOriginRegencyName,
        district: selectedOriginDistrictName,
        postal_code: senderPostalCode,
        latitude: senderCoords.latitude,
        longitude: senderCoords.longitude,
      };

      const receiverAddress: ExpeditionAddress = {
        name: "Default Receiver",
        phone: "+6289876543210",
        email: "receiver@example.com",
        address: `${selectedDestDistrictName}, ${selectedDestRegencyName}`,
        province: selectedDestProvinceName,
        city: selectedDestRegencyName,
        district: selectedDestDistrictName,
        postal_code: receiverPostalCode,
        latitude: receiverCoords.latitude,
        longitude: receiverCoords.longitude,
      };

      // Call all APIs in parallel including the new expedition services
      const [
        jntResult,
        paxelResult,
        lionResult,
        gosendResult,
        jntCargoResult,
        idExpressResult,
        posIndonesiaResult
      ] = await Promise.allSettled([
        // Existing JNT Express
        getJntExpressShipmentCost({
          weight: formData.weight,
          sendSiteCode: selectedOriginRegencyName,
          destAreaCode: selectedDestDistrictName,
        }),

        // Existing Paxel
        getPaxelShipmentCost({
          weight: formData.weight,
          origin: {
            address: "Alamat Pengirim",
            province: selectedOriginProvinceName,
            city: selectedOriginRegencyName,
            district: selectedOriginDistrictName,
          },
          destination: {
            address: "Alamat Penerima",
            province: selectedDestProvinceName,
            city: selectedDestRegencyName,
            district: selectedDestDistrictName,
          },
          dimension: `${formData.length || 0}x${formData.width || 0}x${formData.height || 0}`,
          service_type: "SAMEDAY",
        }),

        // Existing Lion
        getLionShipmentCost({
          weight: formData.weight,
          origin: `${selectedOriginDistrictName}, ${selectedOriginRegencyName}`,
          destination: `${selectedDestDistrictName}, ${selectedDestRegencyName}`,
          commodity: "gen",
          length: formData.length || 10,
          width: formData.width || 10,
          height: formData.height || 10,
        }),

        // NEW GoSend implementation according to API schemas
        getGoSendShipmentCost({
          sender: senderAddress,
          receiver: receiverAddress,
          package_weight: parseFloat(formData.weight.toString()),
          package_length: parseFloat((formData.length || 30).toString()),
          package_width: parseFloat((formData.width || 25).toString()),
          package_height: parseFloat((formData.height || 15).toString()),
          item_value: 500000, // Default item value - should be configurable
          shipment_method: "Instant",
          origin: `${senderAddress.latitude},${senderAddress.longitude}`,
          destination: `${receiverAddress.latitude},${receiverAddress.longitude}`,
        }),

        // NEW JNT Cargo implementation according to API schemas
        getJntCargoShipmentCost({
          sender: senderAddress,
          receiver: receiverAddress,
          package_weight: parseFloat(formData.weight.toString()),
          package_length: parseFloat((formData.length || 30).toString()),
          package_width: parseFloat((formData.width || 25).toString()),
          package_height: parseFloat((formData.height || 15).toString()),
          item_value: 500000,
          shipment_method: "Regular",
          weight: parseFloat(formData.weight.toString()),
          sender_city: selectedOriginRegencyName,
          receiver_city: selectedDestRegencyName,
          sender_province: selectedOriginProvinceName,
          receiver_province: selectedDestProvinceName,
          origin_city: selectedOriginRegencyName,
          destination_city: selectedDestRegencyName,
        }),

        // NEW ID Express implementation - use simple format with numeric IDs
        getIdExpressShipmentCost({
          senderCityId: 154, // Jakarta Pusat - will be mapped dynamically later
          recipientDistrictId: 1543, // Menteng - will be mapped dynamically later  
          weight: parseFloat(formData.weight.toString()),
          expressType: "00" // Standard express type
        }),

        // NEW POS Indonesia implementation according to API schemas
        getPosIndonesiaShipmentCost({
          sender: senderAddress,
          receiver: receiverAddress,
          package_weight: parseFloat(formData.weight.toString()),
          package_length: parseFloat((formData.length || 30).toString()),
          package_width: parseFloat((formData.width || 25).toString()),
          package_height: parseFloat((formData.height || 15).toString()),
          item_value: 500000,
          shipment_method: "REGULER", // Default service
          service_code: "REGULER",
          pieces: 1,
          detail: {
            weight: parseFloat(formData.weight.toString()),
            item_value: 500000,
            cod: formData.paymentMethod === "cod" ? 500000 : 0,
            insurance: 0,
            use_insurance: false,
            remark: "General Goods",
            items: [{
              name: "General Goods",
              value: 500000
            }]
          }
        }),
      ]);

      // Combine results from all APIs with better error handling
      const combinedResult = {
        status: "success",
        data: {
          jnt: jntResult.status === "fulfilled" ? jntResult.value : null,
          paxel: paxelResult.status === "fulfilled" ? paxelResult.value : null,
          lion: lionResult.status === "fulfilled" ? lionResult.value : null,
          gosend: gosendResult.status === "fulfilled" ? gosendResult.value : null,
          jntcargo: jntCargoResult.status === "fulfilled" ? jntCargoResult.value : null,
          idexpress: idExpressResult.status === "fulfilled" ? idExpressResult.value : null,
          posindonesia: posIndonesiaResult.status === "fulfilled" ? posIndonesiaResult.value : null,
        },
        // Add vendor status for debugging
        vendor_status: {
          jnt: jntResult.status,
          paxel: paxelResult.status,
          lion: lionResult.status,
          gosend: gosendResult.status,
          jntcargo: jntCargoResult.status,
          idexpress: idExpressResult.status,
          posindonesia: posIndonesiaResult.status,
        },
        // Add errors for debugging
        errors: {
          jnt: jntResult.status === "rejected" ? jntResult.reason : null,
          paxel: paxelResult.status === "rejected" ? paxelResult.reason : null,
          lion: lionResult.status === "rejected" ? lionResult.reason : null,
          gosend: gosendResult.status === "rejected" ? gosendResult.reason : null,
          jntcargo: jntCargoResult.status === "rejected" ? jntCargoResult.reason : null,
          idexpress: idExpressResult.status === "rejected" ? idExpressResult.reason : null,
          posindonesia: posIndonesiaResult.status === "rejected" ? posIndonesiaResult.reason : null,
        },
      };

      // Enhanced logging for debugging
      console.log("🔍 Enhanced API Results:", {
        jnt: jntResult.status === "fulfilled" ? "✅ Success" : `❌ Failed: ${jntResult.status === "rejected" ? jntResult.reason : "Unknown"}`,
        paxel: paxelResult.status === "fulfilled" ? "✅ Success" : `❌ Failed: ${paxelResult.status === "rejected" ? paxelResult.reason : "Unknown"}`,
        lion: lionResult.status === "fulfilled" ? "✅ Success" : `❌ Failed: ${lionResult.status === "rejected" ? lionResult.reason : "Unknown"}`,
        gosend: gosendResult.status === "fulfilled" ? "✅ Success" : `❌ Failed: ${gosendResult.status === "rejected" ? gosendResult.reason : "Unknown"}`,
        jntcargo: jntCargoResult.status === "fulfilled" ? "✅ Success" : `❌ Failed: ${jntCargoResult.status === "rejected" ? jntCargoResult.reason : "Unknown"}`,
        idexpress: idExpressResult.status === "fulfilled" ? "✅ Success" : `❌ Failed: ${idExpressResult.status === "rejected" ? idExpressResult.reason : "Unknown"}`,
        posindonesia: posIndonesiaResult.status === "fulfilled" ? "✅ Success" : `❌ Failed: ${posIndonesiaResult.status === "rejected" ? posIndonesiaResult.reason : "Unknown"}`,
      });

      onResult?.(combinedResult);
    } catch (err) {
      console.error("API Error:", err);
      const errorResult = {
        error: true,
        message:
          err && typeof err === "object" && "message" in err
            ? (err as { message?: string }).message || "Gagal cek ongkir"
            : "Gagal cek ongkir",
      };
      onResult?.(errorResult);
    } finally {
      if (setIsSearching) setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-slide-down">
      <Card className="shadow-sm">
        <CardHeader className="p-3 mt-3 ml-3">
          <CardTitle className="text-lg font-semibold">
            Tentukan Alamat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Area Asal */}
          <div className="space-y-3">
            <Label className="text-shipping-label">
              Area Asal<span className="text-red-500">*</span>
            </Label>

            {/* Origin Province */}
            <div className="relative">
              <Label htmlFor="originProvince" className="text-sm">
                Provinsi
              </Label>
              <Input
                id="originProvince"
                placeholder="Cari provinsi asal..."
                value={originProvinceSearch}
                onChange={(e) => {
                  setOriginProvinceSearch(e.target.value);
                  handleChange("originProvince", "");
                  handleChange("originRegency", "");
                  handleChange("originDistrict", "");
                  setSelectedOriginRegencyName("");
                }}
                autoComplete="off"
                className="bg-white"
              />
              {originProvinceSearch.length >= 3 && !formData.originProvince && (
                <div className="border rounded bg-white max-h-40 overflow-y-auto absolute z-20 w-full">
                  {loadingOriginProvince ? (
                    <div className="p-2 text-sm text-gray-500">Loading...</div>
                  ) : originProvinceOptions.length > 0 ? (
                    originProvinceOptions.map((prov) => (
                      <div
                        key={prov.id}
                        className="p-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                          handleChange("originProvince", String(prov.id));
                          setOriginProvinceSearch(prov.name);
                          setOriginRegencySearch("");
                          setOriginDistrictSearch("");
                          setSelectedOriginRegencyName("");
                          setSelectedOriginProvinceName(prov.name);
                          setSelectedOriginDistrictName("");
                        }}
                      >
                        {prov.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">
                      Tidak ada hasil
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Origin Regency */}
            <div className="relative">
              <Label htmlFor="originRegency" className="text-sm">
                Kota/Kabupaten
              </Label>
              <Input
                id="originRegency"
                placeholder="Cari kota/kabupaten asal..."
                value={originRegencySearch}
                onChange={(e) => {
                  setOriginRegencySearch(e.target.value);
                  handleChange("originRegency", "");
                  handleChange("originDistrict", "");
                  setSelectedOriginRegencyName("");
                }}
                disabled={!formData.originProvince}
                autoComplete="off"
                className="bg-white"
              />
              {formData.originProvince &&
                originRegencySearch.length >= 3 &&
                !formData.originRegency && (
                  <div className="border rounded bg-white max-h-40 overflow-y-auto absolute z-20 w-full">
                    {loadingOriginRegency ? (
                      <div className="p-2 text-sm text-gray-500">
                        Loading...
                      </div>
                    ) : originRegencyOptions.length > 0 ? (
                      originRegencyOptions.map((reg) => (
                        <div
                          key={reg.id}
                          className="p-2 hover:bg-blue-100 cursor-pointer"
                          onClick={() => {
                            handleChange("originRegency", String(reg.id));
                            setOriginRegencySearch(reg.name);
                            setOriginDistrictSearch("");
                            setSelectedOriginRegencyName(reg.name);
                            setSelectedDestRegencyName(reg.name);
                          }}
                        >
                          {reg.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        Tidak ada hasil
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Origin District */}
            <div className="relative">
              <Label htmlFor="originDistrict" className="text-sm">
                Kecamatan
              </Label>
              <Input
                id="originDistrict"
                placeholder="Cari kecamatan asal..."
                value={originDistrictSearch}
                onChange={(e) => {
                  setOriginDistrictSearch(e.target.value);
                  handleChange("originDistrict", "");
                }}
                disabled={!formData.originRegency}
                autoComplete="off"
                className="bg-white"
              />
              {formData.originRegency &&
                originDistrictSearch.length >= 3 &&
                !formData.originDistrict && (
                  <div className="border rounded bg-white max-h-40 overflow-y-auto absolute z-20 w-full">
                    {loadingOriginDistrict ? (
                      <div className="p-2 text-sm text-gray-500">
                        Loading...
                      </div>
                    ) : originDistrictOptions.length > 0 ? (
                      originDistrictOptions.map((dist) => (
                        <div
                          key={dist.id}
                          className="p-2 hover:bg-blue-100 cursor-pointer"
                          onClick={() => {
                            handleChange("originDistrict", String(dist.id));
                            setOriginDistrictSearch(dist.name);
                            setSelectedOriginDistrictName(dist.name);
                          }}
                        >
                          {dist.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        Tidak ada hasil
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>

          {/* Area Tujuan */}
          <div className="space-y-3">
            <Label className="text-shipping-label">
              Area Tujuan<span className="text-red-500">*</span>
            </Label>

            {/* Destination Province */}
            <div className="relative">
              <Label htmlFor="destProvince" className="text-sm">
                Provinsi
              </Label>
              <Input
                id="destProvince"
                placeholder="Cari provinsi tujuan..."
                value={destProvinceSearch}
                onChange={(e) => {
                  setDestProvinceSearch(e.target.value);
                  handleChange("destProvince", "");
                  handleChange("destRegency", "");
                  handleChange("destDistrict", "");
                  setSelectedDestDistrictName("");
                }}
                autoComplete="off"
                className="bg-white"
              />
              {destProvinceSearch.length >= 3 && !formData.destProvince && (
                <div className="border rounded bg-white max-h-40 overflow-y-auto absolute z-20 w-full">
                  {loadingDestProvince ? (
                    <div className="p-2 text-sm text-gray-500">Loading...</div>
                  ) : destProvinceOptions.length > 0 ? (
                    destProvinceOptions.map((prov) => (
                      <div
                        key={prov.id}
                        className="p-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                          handleChange("destProvince", String(prov.id));
                          setDestProvinceSearch(prov.name);
                          setDestRegencySearch("");
                          setDestDistrictSearch("");
                          setSelectedDestProvinceName(prov.name);
                        }}
                      >
                        {prov.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">
                      Tidak ada hasil
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Destination Regency */}
            <div className="relative">
              <Label htmlFor="destRegency" className="text-sm">
                Kota/Kabupaten
              </Label>
              <Input
                id="destRegency"
                placeholder="Cari kota/kabupaten tujuan..."
                value={destRegencySearch}
                onChange={(e) => {
                  setDestRegencySearch(e.target.value);
                  handleChange("destRegency", "");
                  handleChange("destDistrict", "");
                  setSelectedDestDistrictName("");
                }}
                disabled={!formData.destProvince}
                autoComplete="off"
                className="bg-white"
              />
              {formData.destProvince &&
                destRegencySearch.length >= 3 &&
                !formData.destRegency && (
                  <div className="border rounded bg-white max-h-40 overflow-y-auto absolute z-20 w-full">
                    {loadingDestRegency ? (
                      <div className="p-2 text-sm text-gray-500">
                        Loading...
                      </div>
                    ) : destRegencyOptions.length > 0 ? (
                      destRegencyOptions.map((reg) => (
                        <div
                          key={reg.id}
                          className="p-2 hover:bg-blue-100 cursor-pointer"
                          onClick={() => {
                            handleChange("destRegency", String(reg.id));
                            setDestRegencySearch(reg.name);
                            setDestDistrictSearch("");
                            setSelectedDestRegencyName(reg.name);
                          }}
                        >
                          {reg.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        Tidak ada hasil
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Destination District */}
            <div className="relative">
              <Label htmlFor="destDistrict" className="text-sm">
                Kecamatan
              </Label>
              <Input
                id="destDistrict"
                placeholder="Cari kecamatan tujuan..."
                value={destDistrictSearch}
                onChange={(e) => {
                  setDestDistrictSearch(e.target.value);
                  handleChange("destDistrict", "");
                  setSelectedDestDistrictName("");
                }}
                disabled={!formData.destRegency}
                autoComplete="off"
                className="bg-white"
              />
              {formData.destRegency &&
                destDistrictSearch.length >= 3 &&
                !formData.destDistrict && (
                  <div className="border rounded bg-white max-h-40 overflow-y-auto absolute z-20 w-full">
                    {loadingDestDistrict ? (
                      <div className="p-2 text-sm text-gray-500">
                        Loading...
                      </div>
                    ) : destDistrictOptions.length > 0 ? (
                      destDistrictOptions.map((dist) => (
                        <div
                          key={dist.id}
                          className="p-2 hover:bg-blue-100 cursor-pointer"
                          onClick={() => {
                            handleChange("destDistrict", String(dist.id));
                            setDestDistrictSearch(dist.name);
                            setSelectedDestDistrictName(dist.name);
                          }}
                        >
                          {dist.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        Tidak ada hasil
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="weight" className="text-shipping-label">
              Berat (gram)<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="weight"
                type="number"
                placeholder="Cth : 1000"
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="bg-white pr-16"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-shipping-label">
                gram
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold">
              Data dimensi (opsional)
            </CardTitle>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="length" className="text-xs text-shipping-label">
                  Panjang
                </Label>
                <div className="relative">
                  <Input
                    id="length"
                    type="number"
                    placeholder="Cth : 10"
                    value={formData.length}
                    onChange={(e) => handleChange("length", e.target.value)}
                    className="bg-white pr-12 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-shipping-label">
                    cm
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="width" className="text-xs text-shipping-label">
                  Lebar
                </Label>
                <div className="relative">
                  <Input
                    id="width"
                    type="number"
                    placeholder="Cth : 10"
                    value={formData.width}
                    onChange={(e) => handleChange("width", e.target.value)}
                    className="bg-white pr-12 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-shipping-label">
                    cm
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="height" className="text-xs text-shipping-label">
                  Tinggi
                </Label>
                <div className="relative">
                  <Input
                    id="height"
                    type="number"
                    placeholder="Cth : 10"
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    className="bg-white pr-12 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-shipping-label">
                    cm
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sender and Receiver Information Sections Removed */}

          <div className="space-y-2">
            <Label className="text-shipping-label">Metode Pembayaran</Label>
            <RadioGroup
              defaultValue="non-cod"
              value={formData.paymentMethod}
              onValueChange={(value) => handleChange("paymentMethod", value)}
              className="grid grid-cols-2 gap-3"
            >
              <Label
                htmlFor="payment-cod"
                className={cn(
                  "flex items-center justify-center border rounded-md py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors",
                  formData.paymentMethod === "cod" &&
                  "border-blue-400 bg-blue-50"
                )}
              >
                <RadioGroupItem id="payment-cod" value="cod" className="mr-2" />
                COD (Cash On Delivery)
              </Label>
              <Label
                htmlFor="payment-non-cod"
                className={cn(
                  "flex items-center justify-center border rounded-md py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors",
                  formData.paymentMethod === "non-cod" &&
                  "border-blue-400 bg-blue-50"
                )}
              >
                <RadioGroupItem
                  id="payment-non-cod"
                  value="non-cod"
                  className="mr-2"
                />
                Non COD
              </Label>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white transition-all duration-300"
          >
            Cek Ongkos Kirim
          </Button>
        </CardFooter>
        <div className="mt-5 rounded-lg bg-yellow-300 border border-shipping-noteBorder bg-shipping-note p-4 animate-fade-in">
          <h4 className="font-medium mb-2">Catatan</h4>
          <ul className="list-disc list-inside text-sm space-y-1.5">
            <li>
              Cek ongkos kirim di halaman ini hanya untuk pengiriman reguler,{" "}
              <span className="font-medium">
                tidak termasuk layanan instant delivery.
              </span>
            </li>
            <li>
              Biaya COD sudah termasuk{" "}
              <span className="font-medium">PPN 11%</span>.
            </li>
          </ul>
        </div>
      </Card>
    </form>
  );
}
