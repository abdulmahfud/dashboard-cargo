type ZipCode = {
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  postalCode: string;
};

type ZipResultsProps = {
  selectedZip: ZipCode | null;
};

export default function ZipResults({ selectedZip }: ZipResultsProps) {
  if (!selectedZip || !selectedZip.postalCode) {
    return (
      <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">
          Silakan cari dan pilih alamat untuk melihat kode pos.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        Data Kode Pos
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-700 font-semibold">Provinsi</p>
          <p className="text-gray-900">{selectedZip.provinsi || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-700 font-semibold">Kabupaten / Kota</p>
          <p className="text-gray-900">{selectedZip.kabupaten || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-700 font-semibold">Kecamatan / Distrik</p>
          <p className="text-gray-900">{selectedZip.kecamatan || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-700 font-semibold">Kelurahan / Desa</p>
          <p className="text-gray-900">{selectedZip.desa || "N/A"}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-700 font-semibold">Kode Pos</p>
          <p className="text-gray-900 text-lg font-bold">
            {selectedZip.postalCode} 📋
          </p>
        </div>
      </div>
    </div>
  );
}
