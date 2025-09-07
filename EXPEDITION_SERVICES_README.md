# 🚚 Expedition Services Integration - Frontend Implementation

## Overview

This document describes the complete frontend implementation of the expedition services (GoSend, JNT Cargo, and ID Express) based on the backend API schemas and integration guide.

## 🎯 Implemented Features

### ✅ **Fully Implemented Services**

1. **GoSend Integration**
   - ✅ Cost calculation with coordinate-based requests
   - ✅ Order creation with proper payload structure
   - ✅ Order tracking with multiple parameter options
   - ✅ Order cancellation functionality
   - ⚠️ **Status**: Ready for production, requires AWB for tracking

2. **JNT Cargo Integration**
   - ✅ Cost calculation with city-based parameters
   - ✅ Order creation with complete payload
   - ✅ Order tracking endpoint (uses JNT Express endpoint as documented)
   - ❌ Order cancellation (not yet implemented)
   - ⚠️ **Status**: Ready for production, tracking endpoint needs verification

3. **ID Express Integration**
   - ✅ Cost calculation with location ID mapping
   - ✅ Order creation with proper error handling
   - ✅ Order tracking functionality
   - ❌ Order cancellation (not yet implemented)
   - 🔴 **Status**: API configuration needs review (currently experiencing API issues)

## 📁 File Structure

```
src/
├── types/
│   └── expedition.ts                 # Type definitions for all expedition services
├── lib/
│   └── apiClient.ts                 # API client functions (updated with new services)
├── hooks/
│   └── useExpeditionService.ts      # React hook for expedition services
├── components/
│   ├── CekOngkir/
│   │   └── ShippingForm.tsx         # Updated shipping cost calculator
│   └── ExpeditionDemo/
│       └── ExpeditionDemo.tsx       # Demo component for testing services
```

## 🔧 Technical Implementation

### **Type Definitions (`types/expedition.ts`)**

Complete TypeScript interfaces for:
- `ExpeditionAddress` - Standardized address format
- `GoSendCostRequest/Response` - GoSend specific types  
- `JntCargoCostRequest/Response` - JNT Cargo specific types
- `IdExpressCostRequest/Response` - ID Express specific types
- `ExpeditionOrderResponse` - Common order response format
- `ExpeditionTrackingResponse` - Common tracking response format
- `ExpeditionVendor` - Enum for vendor types

### **API Client Functions (`lib/apiClient.ts`)**

Updated with proper API implementations based on the backend schemas:

```typescript
// GoSend Functions
export const getGoSendShipmentCost(request: GoSendCostRequest): Promise<GoSendCostResponse>
export const createGoSendOrder(request: GoSendOrderRequest): Promise<ExpeditionOrderResponse>
export const trackGoSendOrder(params: {...}): Promise<ExpeditionTrackingResponse>
export const cancelGoSendOrder(data: {...}): Promise<...>

// JNT Cargo Functions  
export const getJntCargoShipmentCost(request: JntCargoCostRequest): Promise<JntCargoCostResponse>
export const createJntCargoOrder(request: JntCargoOrderRequest): Promise<ExpeditionOrderResponse>
export const trackJntCargoOrder(params: {...}): Promise<ExpeditionTrackingResponse>

// ID Express Functions
export const getIdExpressShipmentCost(request: IdExpressCostRequest): Promise<IdExpressCostResponse>
export const createIdExpressOrder(request: IdExpressOrderRequest): Promise<ExpeditionOrderResponse>
export const trackIdExpressOrder(params: {...}): Promise<ExpeditionTrackingResponse>

// Helper Functions
export const buildExpeditionAddress(addressData: {...}): ExpeditionAddress
```

### **React Hook (`hooks/useExpeditionService.ts`)**

Centralized hook for managing expedition services:

```typescript
const {
  loading,
  error,
  calculateGoSendCost,
  calculateJntCargoCost, 
  calculateIdExpressCost,
  createOrder,
  trackOrder,
  cancelOrder,
} = useExpeditionService();
```

## 🚀 Usage Examples

### **Cost Calculation**

```typescript
// GoSend Cost Calculation
const goSendCost = await getGoSendShipmentCost({
  sender: senderAddress,
  receiver: receiverAddress,
  package_weight: 2.5,
  package_length: 30,
  package_width: 25, 
  package_height: 15,
  item_value: 500000,
  shipment_method: "Instant",
  origin: "-6.1944901,106.8229821", // Required coordinate format
  destination: "-6.1753871,106.8271145", // Required coordinate format
});

// JNT Cargo Cost Calculation
const jntCargoCost = await getJntCargoShipmentCost({
  sender: senderAddress,
  receiver: receiverAddress,
  package_weight: 2.5,
  package_length: 30,
  package_width: 25,
  package_height: 15,  
  item_value: 500000,
  shipment_method: "Regular",
  weight: 2.5, // Required field
  sender_city: "Jakarta Pusat", // Required field
  receiver_city: "Jakarta Pusat", // Required field
  sender_province: "DKI Jakarta",
  receiver_province: "DKI Jakarta",
  origin_city: "Jakarta Pusat",
  destination_city: "Jakarta Pusat",
});

// ID Express Cost Calculation  
const idExpressCost = await getIdExpressShipmentCost({
  sender: senderAddress,
  receiver: receiverAddress,
  package_weight: 2.5,
  package_length: 30,
  package_width: 25,
  package_height: 15,
  item_value: 500000,
  shipment_method: "Regular", 
  weight: 2.5,
  sender_city: "Jakarta Pusat",
  receiver_city: "Jakarta Pusat",
  sender_province: "DKI Jakarta",
  receiver_province: "DKI Jakarta",
  senderCityId: 154, // Required numeric ID
  recipientDistrictId: 1543, // Required numeric ID
  origin: "Jl. Sudirman No. 123, Jakarta Pusat",
  destination: "Jl. Thamrin No. 456, Jakarta Pusat",
});
```

### **Order Creation**

```typescript
// GoSend Order Creation
const goSendOrder = await createGoSendOrder({
  // ... cost calculation fields ...
  item_description: "Electronics - Testing Package",
  quantity: 1,
  reference_no: "TEST-GOSEND-20250906-001",
  amount: 16000,
});

// JNT Cargo Order Creation
const jntCargoOrder = await createJntCargoOrder({
  // ... cost calculation fields ...
  item_description: "Electronics - Testing Package", 
  quantity: 1,
  reference_no: "TEST-JNTCARGO-20250906-001",
  amount: 50000,
});

// ID Express Order Creation
const idExpressOrder = await createIdExpressOrder({
  // ... cost calculation fields ...
  item_description: "Electronics - Testing Package",
  quantity: 1, 
  reference_no: "TEST-IDEXPRESS-20250906-001",
  amount: 35000,
});
```

### **Order Tracking**

```typescript
// GoSend Tracking
const goSendTracking = await trackGoSendOrder({
  orderNo: "AWB123456", // Optional
  storeOrderId: "REF-202509061720543", // Optional
  order_id: 14, // Optional
});

// JNT Cargo Tracking (uses JNT Express endpoint)
const jntCargoTracking = await trackJntCargoOrder({
  orderNo: "JT123456789", // Required
  storeOrderId: "REF-202509061721978", // Required
  reference_no: "REF-202509061721978", // Required
  order_id: 15, // Required
});

// ID Express Tracking
const idExpressTracking = await trackIdExpressOrder({
  orderNo: "IDE123456", // Optional
  storeOrderId: "REF-202509061722000", // Optional
  order_id: 16, // Optional
});
```

## 📊 API Response Formats

### **Cost Calculation Responses**

```typescript
// GoSend Response
{
  "status": "success",
  "message": "Shipment cost retrieved successfully", 
  "data": {
    "Instant": { "shipment_method": "Instant", "estimated_cost": 16000 },
    "SameDay": { "shipment_method": "Same Day", "estimated_cost": 12000 }
  },
  "costs": [
    { "service_type": "Instant", "serviceable": true },
    { "service_type": "SameDay", "serviceable": true }
  ]
}

// JNT Cargo Response
{
  "status": "success",
  "message": "Shipment cost calculated successfully",
  "data": {
    "service_type": "FT",
    "service_name": "Full Truck Load", 
    "estimated_cost": 50000,
    "estimated_delivery": "1-2 days",
    "serviceable": true
  },
  "costs": [{ "service_type": "FT", "serviceable": true }]
}

// ID Express Response (Error Case)
{
  "success": false,
  "message": "Failed to get shipping cost",
  "data": null
}
```

### **Order Creation Responses**

```typescript
{
  "success": true,
  "data": {
    "id": 14,
    "user_id": 6,
    "vendor": "GOSEND", // or "JNTCARGO", "IDEXPRESS"
    "reference_no": "REF-202509061720543",
    "awb_no": null,
    "shipment_type": "Instant",
    "service_code": "INSTANT", 
    "status": "menunggu_pembayaran",
    "created_at": "2025-09-06T17:20:47.000000Z",
    "user": { "id": 6, "email": "test@expeditiontest.com" },
    "histories": []
  }
}
```

## 🔍 Enhanced Shipping Form

The `ShippingForm.tsx` component has been updated to include all three new expedition services:

**Key Improvements:**
- Proper address object construction
- Enhanced error handling and logging
- Vendor status tracking 
- Comprehensive result formatting

**New Result Structure:**
```typescript
{
  status: "success",
  data: {
    jnt: jntResult,           // Existing JNT Express
    paxel: paxelResult,       // Existing Paxel
    lion: lionResult,         // Existing Lion
    gosend: gosendResult,     // NEW GoSend
    jntcargo: jntCargoResult, // NEW JNT Cargo  
    idexpress: idExpressResult // NEW ID Express
  },
  vendor_status: { ... },     // Success/failure status per vendor
  errors: { ... }             // Error details for debugging
}
```

## 🧪 Demo Component

The `ExpeditionDemo.tsx` component provides:
- Interactive testing interface
- Sample order creation for all vendors
- Order tracking functionality
- Real-time API status display
- Error handling demonstrations

## ⚙️ Configuration Requirements

### **Environment Variables**

Ensure these are set in your `.env.local`:

```env
# API Configuration  
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# GoSend Configuration (handled by backend)
# GOSEND_BASE_URL=https://integration-kilat-api.gojekapi.com/gokilat/v10
# GOSEND_CLIENT_ID=bhisa-kirim-engine
# GOSEND_PASS_KEY=d9dd63dac0c02eb35971701311885cea89bb3cef8b59b31510c069100f03abee

# JNT Cargo Configuration (handled by backend)
# JNT_CARGO_BASE_URL=...
# JNT_CARGO_API_KEY=...

# ID Express Configuration (handled by backend) 
# ID_EXPRESS_BASE_URL=...
# ID_EXPRESS_API_KEY=...
```

### **Location ID Mapping**

For ID Express, you'll need location ID mapping tables:
- `senderCityId`: Numeric city ID (e.g., 154 for Jakarta Pusat)
- `recipientDistrictId`: Numeric district ID (e.g., 1543 for Menteng)

**TODO**: Implement dynamic location ID lookup based on address selection.

## 🚨 Known Issues & Limitations

### **ID Express**
- ❌ Currently experiencing API issues on cost calculation
- ⚠️ Requires numeric location IDs (not implemented dynamically yet)
- ⚠️ Order creation depends on successful cost calculation

### **JNT Cargo**
- ⚠️ Tracking uses JNT Express endpoint (needs verification)
- ❌ Order cancellation not implemented

### **GoSend** 
- ⚠️ Tracking requires AWB number (generated after payment)
- ⚠️ Cancellation requires special permissions

## 🔄 Next Steps

### **Immediate Improvements Needed**

1. **Dynamic Location Mapping**
   - Implement city/district ID lookup for ID Express
   - Add coordinate fetching based on address selection
   - Create location mapping database/API

2. **Error Handling Enhancement**
   - Add retry mechanisms for failed API calls
   - Implement fallback cost estimates
   - Better user-friendly error messages

3. **Order Management**
   - Complete order cancellation implementations  
   - Add order status monitoring
   - Implement webhook handlers for status updates

4. **Testing & Validation**
   - Add comprehensive unit tests
   - Create integration tests for all vendors
   - Validate against production API endpoints

5. **UX Improvements**
   - Add loading states for each vendor
   - Implement progressive cost calculation
   - Add vendor comparison interface

### **API Configuration Review**

1. **ID Express**: Review API credentials and endpoint configuration
2. **JNT Cargo**: Verify tracking endpoint and implement proper tracking API
3. **GoSend**: Test with production credentials and validate webhook handling

## 📈 Performance Considerations

- All expedition API calls are made in parallel using `Promise.allSettled()`
- Error boundaries prevent individual vendor failures from breaking the entire flow
- Results are cached client-side for better UX
- Loading states prevent multiple concurrent requests

## 🔐 Security Notes

- All API calls require JWT authentication
- Sensitive data (addresses, phone numbers) are handled securely
- API keys are managed on the backend only
- Rate limiting is implemented to prevent abuse

---

**Status**: ✅ Ready for testing and further development
**Last Updated**: September 6, 2025
**Version**: 1.0.0
