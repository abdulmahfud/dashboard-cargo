import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardTitle } from "../ui/card";
import { searchAddress } from "@/lib/apiClient";
import type { SearchResult } from "@/types/addressSearch";

type ZipCode = {
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  postalCode: string;
};

type ZipCodeFormProps = {
  onSelectZip: (zip: ZipCode) => void;
};

export default function ZipCodeForm({ onSelectZip }: ZipCodeFormProps) {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value.length >= 3) {
      setIsLoading(true);
      try {
        const response = await searchAddress(value);

        // Process the API response - now we can use the label directly
        const results: SearchResult[] = [];

        for (const postalCode of response.postal_codes) {
          const subdistrict = response.subdistricts.find(
            (s) => s.id === postalCode.subdistrict_id
          );

          if (subdistrict) {
            results.push({
              subdistrict,
              district: undefined, // Not needed since we have label
              regency: undefined, // Not needed since we have label
              province: undefined, // Not needed since we have label
              postal_code: postalCode,
            });
          }
        }

      setFilteredResults(results);
      } catch (error) {
        console.error("Error searching address:", error);
        setFilteredResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setFilteredResults([]);
    }
  };

  const handleSelect = (result: SearchResult) => {
    // Parse the label to extract address components
    // Format: "NGRANDU LOR, PETERONGAN, JOMBANG, JAWA TIMUR - 61481"
    const label = result.postal_code.label;
    const parts = label.split(" - ")[0].split(", "); // Remove postal code and split by comma

    const zipCode: ZipCode = {
      desa: parts[0] || result.subdistrict.name,
      kecamatan: parts[1] || "",
      kabupaten: parts[2] || "",
      provinsi: parts[3] || "",
      postalCode: result.postal_code.code.toString(),
    };

    onSelectZip(zipCode);
    setQuery(label); // Use the full label as query
    setFilteredResults([]);
  };

  return (
    <Card className="border border-muted rounded-xl shadow-sm mx-2 h-80">
      <CardContent className="h-full flex p-12">
        <div className="relative space-y-6">
          <CardTitle className="text-2xl font-bold text-blue-500">
            Pencarian Kode Pos
          </CardTitle>
          <label className="block font-semibold mb-2">
            Cari kode pos alamat tujuan, isi minimal 3 karakter
          </label>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan desa, kecamatan, atau kota..."
            />
            <Search
              className="absolute right-3 top-3 text-gray-500"
              size={20}
            />
          </div>

          {/* Dropdown hasil pencarian */}
          {isLoading && query.length >= 3 && (
            <div className="absolute w-full bg-white border border-gray-300 mt-2 rounded-lg shadow-lg z-10 p-3">
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                <span className="text-gray-500">Mencari...</span>
              </div>
            </div>
          )}
          {!isLoading && filteredResults.length > 0 && (
            <ul className="absolute w-full bg-white border border-gray-300 mt-2 rounded-lg shadow-lg z-10">
              {filteredResults.map((result, index) => (
                <li
                  key={index}
                  className="p-3 hover:bg-blue-100 cursor-pointer"
                  onClick={() => handleSelect(result)}
                >
                  {result.postal_code.label}
                </li>
              ))}
            </ul>
          )}

          {/* Tombol Reset */}
          <button
            onClick={() => {
              setQuery("");
              setFilteredResults([]);
              onSelectZip({
                desa: "",
                kecamatan: "",
                kabupaten: "",
                provinsi: "",
                postalCode: "",
              });
            }}
            className="mt-3 px-4 py-2 border font-semibold bg-blue-400 border-blue-500 text-white rounded-lg hover:bg-blue-500 hover:text-white transition duration-200"
          >
            Reset
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
