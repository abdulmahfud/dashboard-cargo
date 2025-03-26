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
import { Pencil, Trash } from "lucide-react";

interface ShippingData {
  id: number;
  businessName: string;
  businessAddress: string;
  senderName: string;
  phoneNumber: string;
  village: string;
}

export default function ListSender() {
  // Data Dummy
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<ShippingData[]>([
    {
      id: 1,
      businessName: "Toko Maju Jaya",
      businessAddress: "Jl. Sudirman No. 10, Jakarta",
      senderName: "Budi Santoso",
      phoneNumber: "0812-3456-7890",
      village: "Kelurahan Menteng",
    },
    {
      id: 2,
      businessName: "Warung Bu Tini",
      businessAddress: "Jl. Diponegoro No. 5, Bandung",
      senderName: "Tini Wahyuni",
      phoneNumber: "0813-9876-5432",
      village: "Kelurahan Dago",
    },
    {
      id: 3,
      businessName: "Grosir Sembako Sejahtera",
      businessAddress: "Jl. Merdeka No. 20, Surabaya",
      senderName: "Andi Wijaya",
      phoneNumber: "0856-1234-5678",
      village: "Kelurahan Tambaksari",
    },
  ]);

  // Filter berdasarkan pencarian
  const filteredData = data.filter((item) =>
    item.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Hapus Data
  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="p-3">
        <CardTitle className="text-lg font-semibold">
          Daftar Alamat Pengiriman
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Input Pencarian */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Cari Nama Usaha..."
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
                <TableHead className="w-[30%]">Nama Usaha</TableHead>
                <TableHead className="w-[30%]">Alamat Usaha</TableHead>
                <TableHead>Nama Pengirim</TableHead>
                <TableHead>Nomor Telepon</TableHead>
                <TableHead>Kelurahan</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.businessName}</TableCell>
                    <TableCell>{item.businessAddress}</TableCell>
                    <TableCell>{item.senderName}</TableCell>
                    <TableCell>{item.phoneNumber}</TableCell>
                    <TableCell>{item.village}</TableCell>
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
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    Tidak ada data ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
