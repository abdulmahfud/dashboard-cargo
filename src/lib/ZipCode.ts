export const zipCodes = [
  {
    desa: "Sukamaju",
    kecamatan: "Cilandak",
    kabupaten: "Jakarta Selatan",
    provinsi: "DKI Jakarta",
    postalCode: "12345",
  },
  {
    desa: "Mekarsari",
    kecamatan: "Cibinong",
    kabupaten: "Bogor",
    provinsi: "Jawa Barat",
    postalCode: "16914",
  },
  {
    desa: "Sidodadi",
    kecamatan: "Tumpang",
    kabupaten: "Malang",
    provinsi: "Jawa Timur",
    postalCode: "65156",
  },
  {
    desa: "Karanganyar",
    kecamatan: "Kebumen",
    kabupaten: "Kebumen",
    provinsi: "Jawa Tengah",
    postalCode: "54361",
  },
  {
    desa: "Tegalsari",
    kecamatan: "Denpasar Barat",
    kabupaten: "Denpasar",
    provinsi: "Bali",
    postalCode: "80111",
  },
];

// Fungsi pencarian berdasarkan query minimal 3 huruf
export const searchZipCodes = (query: string) => {
  if (query.length < 3) return [];
  return zipCodes.filter((zip) =>
    Object.values(zip).some((val) =>
      val.toLowerCase().includes(query.toLowerCase())
    )
  );
};
