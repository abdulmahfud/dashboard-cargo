# Frontend Discount Integration Guide

## Overview
Sistem diskon telah berhasil diintegrasikan ke frontend untuk menampilkan diskon ekspedisi secara real-time saat user memilih opsi pengiriman.

## Fitur yang Ditambahkan

### 1. API Client Integration
- **File**: `src/lib/apiClient.ts`
- **Function**: `getAvailableDiscounts()`
- **Endpoint**: `/api/admin/expedition-discounts/available`

### 2. UI Components

#### DiscountBadge Component
- **File**: `src/components/ui/discount-badge.tsx`
- **Purpose**: Menampilkan badge diskon dengan ikon dan format yang sesuai
- **Features**:
  - Support percentage dan fixed amount discount
  - Menampilkan jumlah penghematan
  - Icon yang berbeda untuk jenis diskon

#### Enhanced ShippingCard Component
- **File**: `src/components/ui/shipping-card.tsx`
- **New Props**: `discountInfo?: DiscountCalculation`
- **Features**:
  - Menampilkan harga asli dan harga setelah diskon
  - Badge diskon untuk opsi yang dipilih
  - Format currency yang konsisten

### 3. Updated Pages

#### PaketReguler CalculationResults
- **File**: `src/components/PaketReguler/CalculationResults.tsx`
- **Features**:
  - Real-time discount calculation saat pilih ekspedisi
  - Display diskon di shipping card
  - Display penghematan di payment summary
  - Loading indicator saat mengecek diskon

#### PaketInstant CalculationResults  
- **File**: `src/components/PaketInstant/CalculationResults.tsx`
- **Features**:
  - Batch loading discount untuk semua opsi
  - Display diskon di featured card dan shipping options
  - Dynamic total calculation dengan diskon
  - Loading state untuk discount checking

## Cara Kerja Sistem

### 1. Flow Discount pada PaketReguler
```typescript
// User memilih shipping option
handleShippingSelect(optionId) → 
  calculateDiscount(optionId) → 
    getAvailableDiscounts API call → 
      Update discountInfo state → 
        Re-render dengan harga diskon
```

### 2. Flow Discount pada PaketInstant
```typescript
// Component mount/options change
useEffect() → 
  loadDiscounts() → 
    Loop semua options → 
      getAvailableDiscounts untuk setiap option → 
        Update discountsMap → 
          Re-render semua cards dengan diskon
```

### 3. API Call Structure
```typescript
getAvailableDiscounts({
  vendor: 'JNTEXPRESS',
  service_type: 'REGULER', 
  order_value: 50000
})
```

### 4. Response Structure
```typescript
{
  status: 'success',
  data: {
    available_discounts: [...],
    best_discount: {
      has_discount: true,
      discount_amount: 5000,
      discounted_price: 45000,
      original_price: 50000,
      discount_id: 1,
      discount_description: 'Diskon 10% untuk JNTEXPRESS',
      discount_type: 'percentage',
      discount_value: 10.00
    }
  }
}
```

## Display Components

### 1. Shipping Option dengan Diskon
- ✅ Harga asli dicoret 
- ✅ Harga diskon berwarna hijau
- ✅ Badge diskon (10% OFF, Rp5.000 OFF)
- ✅ Jumlah penghematan

### 2. Payment Summary dengan Diskon
- ✅ Breakdown pengiriman dengan diskon
- ✅ Line item "Hemat Diskon" 
- ✅ Total yang sudah dipotong diskon

### 3. Loading States
- ✅ "Mengecek diskon..." saat API call
- ✅ Spinner icon animation
- ✅ Graceful fallback jika error

## Testing

### Manual Testing Steps
1. Buka halaman `/dashboard/paket/paket-reguler`
2. Isi form dan cek ongkir
3. Pilih salah satu opsi pengiriman
4. Verify diskon muncul (jika ada)
5. Check payment summary menampilkan diskon
6. Repeat untuk `/dashboard/paket/paket-instant`

### Expected Behavior
- ✅ Discount badge muncul untuk opsi dengan diskon
- ✅ Harga terpotong diskon
- ✅ Total calculation benar
- ✅ Loading state smooth
- ✅ Error handling graceful

## Error Handling

### API Error
- Jika API error, tampilkan harga normal tanpa diskon
- Log error ke console untuk debugging
- Tidak mengganggu user experience

### Network Error  
- Retry logic otomatis (handled by axios)
- Timeout 30 detik
- Fallback ke harga normal

## Performance Considerations

### PaketReguler
- Discount hanya dipanggil saat user pilih opsi
- Single API call per selection
- Minimal impact pada performance

### PaketInstant
- Batch loading saat component mount
- Parallel API calls untuk efisiensi
- Caching di component state

## Future Enhancements

1. **Discount Caching**: Cache discount info di localStorage
2. **User-Specific Discounts**: Integrate dengan user profile
3. **Discount Expiry**: Show countdown untuk discount terbatas
4. **Multiple Discounts**: Support stacking discounts
5. **Discount Comparison**: Show best available discount

## Troubleshooting

### Discount tidak muncul
1. Check backend discount data: `ExpeditionDiscount::active()->count()`
2. Verify API endpoint accessible: `GET /api/admin/expedition-discounts/available`
3. Check browser console untuk API errors
4. Verify permissions untuk discount endpoint

### Harga salah setelah diskon
1. Check `calculateTotal()` function menggunakan `discountInfo`
2. Verify discount calculation di backend
3. Check currency formatting

### Loading tidak berhenti
1. Check API timeout settings
2. Verify error handling di `finally` block
3. Check network connectivity