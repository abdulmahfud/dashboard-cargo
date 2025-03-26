import { useState } from "react";
import { Search } from "lucide-react";
import { Card,CardContent, CardTitle } from "../ui/card";

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

const zipData: ZipCode[] = [
  {
    desa: "Mancar",
    kecamatan: "Peterongan",
    kabupaten: "Jombang",
    provinsi: "Jawa Timur",
    postalCode: "61481",
  },
  {
    desa: "Candi",
    kecamatan: "Driyorejo",
    kabupaten: "Gresik",
    provinsi: "Jawa Timur",
    postalCode: "61177",
  },
];

export default function ZipCodeForm({ onSelectZip }: ZipCodeFormProps) {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<ZipCode[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value.length >= 3) {
      const results = zipData.filter(
        (zip) =>
          zip.desa.toLowerCase().includes(value.toLowerCase()) ||
          zip.kecamatan.toLowerCase().includes(value.toLowerCase()) ||
          zip.kabupaten.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  };

  const handleSelect = (zip: ZipCode) => {
    onSelectZip(zip);
    setQuery(
      `${zip.desa}, ${zip.kecamatan}, ${zip.kabupaten}, ${zip.provinsi}`
    );
    setFilteredResults([]);
  };

  return (
    <Card className="border border-muted rounded-xl shadow-sm mx-2 h-80">
      <CardContent className="h-full flex p-12">
        <div className="relative space-y-6">
          <CardTitle className="text-2xl font-bold text-blue-500">Pencarian Kode Pos</CardTitle>
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
          {filteredResults.length > 0 && (
            <ul className="absolute w-full bg-white border border-gray-300 mt-2 rounded-lg shadow-lg z-10">
              {filteredResults.map((zip, index) => (
                <li
                  key={index}
                  className="p-3 hover:bg-blue-100 cursor-pointer"
                  onClick={() => handleSelect(zip)}
                >
                  {zip.desa}, {zip.kecamatan}, {zip.kabupaten}, {zip.provinsi} -{" "}
                  {zip.postalCode}
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
