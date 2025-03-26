import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash, ChevronLeft, ChevronRight } from "lucide-react";

interface ShippingData {
  id: number;
  recipientName: string;
  phoneNumber: string;
  village: string;
  completeAddress: string;
  paymentMethod: string;
  useInsurance: boolean;
}

export default function RecipientList() {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Data Dummy
  const [data, setData] = useState<ShippingData[]>([
    {
      id: 1,
      recipientName: "Dian Saputra",
      phoneNumber: "0812-3456-7890",
      village: "Kelurahan Cempaka Putih",
      completeAddress: "Jl. Anggrek No. 12, Jakarta Pusat",
      paymentMethod: "COD",
      useInsurance: true,
    },
    {
      id: 2,
      recipientName: "Rina Kartini",
      phoneNumber: "0857-6543-2109",
      village: "Kelurahan Kebon Jeruk",
      completeAddress: "Jl. Mawar No. 25, Jakarta Barat",
      paymentMethod: "Transfer Bank",
      useInsurance: false,
    },
    {
      id: 3,
      recipientName: "Taufik Hidayat",
      phoneNumber: "0821-7894-1234",
      village: "Kelurahan Cilandak",
      completeAddress: "Jl. Melati No. 30, Jakarta Selatan",
      paymentMethod: "E-Wallet",
      useInsurance: true,
    },
    {
      id: 4,
      recipientName: "Andi Wijaya",
      phoneNumber: "0813-2222-3333",
      village: "Kelurahan Tebet",
      completeAddress: "Jl. Sakura No. 15, Jakarta Selatan",
      paymentMethod: "COD",
      useInsurance: false,
    },
  ]);

  // Filter berdasarkan pencarian
  const filteredData = data.filter((item) =>
    item.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle Hapus Data
  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="p-3">
        <CardTitle className="text-lg font-semibold">
          Daftar Penerima Pengiriman
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Input Pencarian */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Cari Nama Penerima..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white"
          />
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">Nama Penerima</TableHead>
                <TableHead className="w-[15%]">Nomor Telepon</TableHead>
                <TableHead className="w-[15%]">Kelurahan</TableHead>
                <TableHead className="w-[30%]">Alamat Lengkap</TableHead>
                <TableHead className="w-[10%]">Metode Bayar</TableHead>
                <TableHead className="w-[10%] text-center">Asuransi</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.recipientName}</TableCell>
                    <TableCell>{item.phoneNumber}</TableCell>
                    <TableCell>{item.village}</TableCell>
                    <TableCell>{item.completeAddress}</TableCell>
                    <TableCell>{item.paymentMethod}</TableCell>
                    <TableCell className="text-center">
                      {item.useInsurance ? "✅" : "❌"}
                    </TableCell>
                    <TableCell className="flex justify-center space-x-2">
                      <Button size="icon" variant="outline">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    Tidak ada data ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </Button>
          <span className="text-sm">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
