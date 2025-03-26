import { Input } from "@/components/ui/input";
import { useRef } from "react";

interface CurrencyInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CurrencyInput({
  id,
  value,
  onChange,
  placeholder = "Contoh: 1.000.000",
}: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Fungsi Format Rupiah
  const formatRupiah = (value: string) => {
    const numericValue = value.replace(/\D/g, ""); // Hanya angka
    return numericValue
      ? new Intl.NumberFormat("id-ID").format(Number(numericValue))
      : "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatRupiah(rawValue);
    onChange(formattedValue);

    // **Atur posisi kursor ke akhir (fix masalah input jumping)**
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.selectionStart = inputRef.current.value.length;
        inputRef.current.selectionEnd = inputRef.current.value.length;
      }
    });
  };

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="pl-14 pr-3 w-full" // **Padding kiri lebih besar**
      />
    </div>
  );
}
