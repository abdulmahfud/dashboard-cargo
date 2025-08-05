# Debug Guide - Discount Management

## Issue Fixed

Backend mengirim response dengan field `status` sedangkan frontend mengharapkan `success`.

## Changes Made

### 1. Updated API Client Types

- **File**: `src/lib/apiClient.ts`
- **Changes**: Updated return types untuk support both `status` dan `success` fields

### 2. Updated DiscountManagement Logic

- **File**: `src/components/DiskonPengiriman/DiscountManagement.tsx`
- **Changes**: Added support untuk handling both response formats

## How to Test

### 1. Open Browser Console

1. Buka `/dashboard/paket/diskon-pengiriman`
2. Buka Developer Tools (F12)
3. Pergi ke Console tab

### 2. Check Debug Logs

Sekarang akan muncul debug logs:

```
API Response: { status: "success", data: { current_page: 1, data: [...] } }
Discounts loaded: [array of discount objects]
```

### 3. Verify Data Display

- Data discount seharusnya muncul di tabel
- Jika tidak muncul, cek console untuk error messages

## Response Structure Expected

### Backend Response (Actual):

```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 8,
        "vendor": "JNTEXPRESS",
        "service_type": null,
        "discount_type": "percentage",
        "discount_value": "20.00",
        "minimum_order_value": "100000.00",
        "maximum_discount_amount": "30000.00",
        "user_type": null,
        "is_active": true,
        "valid_from": "2025-08-08T17:00:00.000000Z",
        "valid_until": "2025-08-10T16:59:59.000000Z",
        "description": "Weekend Special - Diskon 20% JNT Express",
        "usage_limit": 100,
        "usage_count": 0,
        "priority": 3,
        "created_at": "2025-08-04T09:16:44.000000Z",
        "updated_at": "2025-08-04T09:16:44.000000Z"
      }
    ],
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

### Frontend Now Handles:

- ✅ `response.status === "success"` (dari backend)
- ✅ `response.success` (fallback jika ada)

## Troubleshooting

### If Still No Data Shows:

1. **Check Console**: Apakah ada error atau log?
2. **Check Network Tab**: Apakah API call berhasil?
3. **Check Response**: Apakah structure sesuai expected?

### Common Issues:

1. **Authentication**: Pastikan user login dan punya permission `discounts.view`
2. **API Endpoint**: Pastikan endpoint `/admin/expedition-discounts` accessible
3. **CORS**: Pastikan frontend bisa akses backend API

## Next Steps

Setelah data muncul, test juga:

1. **Create New Discount**: Klik "Tambah Diskon"
2. **Edit Existing**: Klik action menu "Edit"
3. **Toggle Status**: Klik action menu "Aktifkan/Nonaktifkan"
4. **Delete**: Klik action menu "Hapus"

Semua operasi sekarang sudah support both response formats!
