// Business data for shipping form
export const businessData = [
  {
    id: 1,
    businessName: "Toko Elektronik Jaya",
    senderName: "Ahmad Sanjaya",
    contact: "081234567890",
    address: "Jl. Mawar No. 123, Surabaya, Jawa Timur",
  },
  {
    id: 2,
    businessName: "Fashion Store Indah",
    senderName: "Linda Wijaya",
    contact: "087654321098",
    address: "Jl. Melati No. 45, Jakarta Selatan",
  },
  {
    id: 3,
    businessName: "Toko Buku Cerdas",
    senderName: "Budi Santoso",
    contact: "089876543210",
    address: "Jl. Kenanga No. 67, Bandung, Jawa Barat",
  },
];

export const businessRecipients = [
  {
    id: 1,
    name: "Ahmad Ramadhan",
    phone: "081234567890",
    destinationarea: "Taman Cari, Purbolinggo, Lampung Timur, Lampung, 34192",
    address: "Jl. Sudirman No. 10, Jakarta",
  },
  {
    id: 2,
    name: "Siti Aisyah",
    phone: "081987654321",
    destinationarea: "Taman Cari, Purbolinggo, Lampung Timur, Lampung, 34192",
    address: "Jl. Merdeka Raya, Bandung",
  },
  {
    id: 3,
    name: "Budi Santoso",
    phone: "085678901234",
    destinationarea: "Taman Cari, Purbolinggo, Lampung Timur, Lampung, 34192",
    address: "Jl. Diponegoro No. 15, Surabaya",
  },
];


export const itemTypes = [
  "Elektronik",
  "Fashion",
  "Buku",
  "Makanan",
  "Kosmetik",
  "Aksesoris",
  "Lainnya",
];

export interface CourierOption {
  id: string;
  name: string;
  logo: string;
  currentPrice: number;
  originalPrice?: number;
  estimatedDays: string;
  returnPotential: "Rendah" | "Sedang" | "Tinggi";
  type: "Regular" | "Economy" | "One Day";
}

export const courierOptions: CourierOption[] = [
  {
    id: "id-express",
    name: "ID Express Flat",
    logo: "/logos/id-express.png",
    currentPrice: 23700,
    estimatedDays: "1-2 Hari",
    returnPotential: "Rendah",
    type: "Regular",
  },
  {
    id: "anteraja",
    name: "AnterAja Regular",
    logo: "/logos/anteraja.png",
    currentPrice: 18525,
    originalPrice: 19500,
    estimatedDays: "1-2 Hari",
    returnPotential: "Rendah",
    type: "Regular",
  },
  {
    id: "lion-parcel",
    name: "Lion Regpack",
    logo: "/logos/lion.png",
    currentPrice: 18900,
    originalPrice: 21000,
    estimatedDays: "1-2 Hari",
    returnPotential: "Rendah",
    type: "Regular",
  },
  {
    id: "sicepat",
    name: "Sicepat REGULER",
    logo: "/logos/sicepat.png",
    currentPrice: 19950,
    originalPrice: 21000,
    estimatedDays: "1-2 Hari",
    returnPotential: "Rendah",
    type: "Regular",
  },
  {
    id: "jne",
    name: "JNE Express City to City",
    logo: "/logos/jne.png",
    currentPrice: 20370,
    originalPrice: 21000,
    estimatedDays: "3-4 Hari",
    returnPotential: "Rendah",
    type: "Regular",
  },
];

export interface ShippingDetails {
  courier: string;
  shipping: number;
  discount: number;
  insurance: number;
  total: number;
}

export const initialShippingDetails: ShippingDetails = {
  courier: "AnterAja Regular",
  shipping: 19500,
  discount: 975,
  insurance: 9000,
  total: 27525,
};
