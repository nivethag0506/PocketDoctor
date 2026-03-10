# 📚 EduAid API Documentation

## Overview

The EduAid REST API provides endpoints for managing scholarship applications, users, vendors, activities, and disbursements. All API endpoints are prefixed with `/api`.

---

## 🔐 Authentication

API requests require authentication via JWT tokens or wallet signatures.

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 📋 Endpoints

### Applications API

#### Create Application

```http
POST /api/applications
```

**Request Body:**

```json
{
  "studentAddress": "0x1234...5678",
  "scholarshipType": "TUITION",
  "amount": 50000,
  "documents": {
    "incomeProof": "ipfs://...",
    "marksheet": "ipfs://...",
    "idProof": "ipfs://..."
  },
  "cgpa": 8.5,
  "familyIncome": 150000,
  "attendance": 92
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "studentAddress": "0x1234...5678",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### Get All Applications

```http
GET /api/applications
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (PENDING, APPROVED, REJECTED) |
| `category` | string | Filter by spending category |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "studentAddress": "0x1234...5678",
      "scholarshipType": "TUITION",
      "amount": 50000,
      "status": "PENDING",
      "aiScore": 0.95,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "pages": 16
  }
}
```

---

#### Update Application Status

```http
PUT /api/applications/:id/status
```

**Request Body:**

```json
{
  "status": "APPROVED",
  "reviewerAddress": "0xadmin...1234",
  "comments": "Documents verified successfully"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "status": "APPROVED",
    "approvedAt": "2024-01-16T14:22:00.000Z",
    "reviewerAddress": "0xadmin...1234"
  }
}
```

---

### Users API

#### Get User Profile

```http
GET /api/users/:address
```

**Response:**

```json
{
  "success": true,
  "data": {
    "walletAddress": "0x1234...5678",
    "role": "STUDENT",
    "name": "Rahul Kumar",
    "email": "rahul@example.com",
    "kycVerified": true,
    "balance": 25000,
    "approvedCategories": ["TUITION", "BOOKS"],
    "createdAt": "2024-01-10T08:00:00.000Z"
  }
}
```

---

#### Update KYC Status

```http
PUT /api/users/:address/kyc
```

**Request Body:**

```json
{
  "kycVerified": true,
  "verifiedBy": "0xadmin...1234",
  "documents": {
    "aadhaar": "verified",
    "panCard": "verified"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "walletAddress": "0x1234...5678",
    "kycVerified": true,
    "kycVerifiedAt": "2024-01-16T15:00:00.000Z"
  }
}
```

---

#### Sync Blockchain Balance

```http
PUT /api/users/:address/balance
```

**Request Body:**

```json
{
  "balance": 45000,
  "txHash": "0xabc123..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "walletAddress": "0x1234...5678",
    "balance": 45000,
    "lastSyncedAt": "2024-01-16T15:30:00.000Z"
  }
}
```

---

### Vendors API

#### Register Vendor

```http
POST /api/vendors
```

**Request Body:**

```json
{
  "vendorAddress": "0xvendor...5678",
  "name": "College Bookstore",
  "category": "BOOKS",
  "location": {
    "address": "123 University Road",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001"
  },
  "documents": {
    "gstCertificate": "ipfs://...",
    "bankDetails": "ipfs://..."
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f2a3b4c5d6e7f8a9b0c1d2",
    "vendorAddress": "0xvendor...5678",
    "name": "College Bookstore",
    "category": "BOOKS",
    "whitelisted": false,
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

#### Whitelist Vendor

```http
PUT /api/vendors/:id/whitelist
```

**Request Body:**

```json
{
  "whitelisted": true,
  "approvedBy": "0xadmin...1234",
  "validUntil": "2025-01-15T00:00:00.000Z"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f2a3b4c5d6e7f8a9b0c1d2",
    "whitelisted": true,
    "whitelistedAt": "2024-01-16T16:00:00.000Z",
    "txHash": "0xdef456..."
  }
}
```

---

#### Get All Vendors

```http
GET /api/vendors
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category |
| `whitelisted` | boolean | Filter by whitelist status |
| `city` | string | Filter by city |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f2a3b4c5d6e7f8a9b0c1d2",
      "vendorAddress": "0xvendor...5678",
      "name": "College Bookstore",
      "category": "BOOKS",
      "whitelisted": true,
      "location": {
        "city": "Bangalore",
        "state": "Karnataka"
      }
    }
  ]
}
```

---

### Activities API

#### Get Activity Logs

```http
GET /api/activities
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | string | Filter by wallet address |
| `action` | string | Filter by action type |
| `startDate` | string | Start date (ISO format) |
| `endDate` | string | End date (ISO format) |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f3a4b5c6d7e8f9a0b1c2d3",
      "user": "0x1234...5678",
      "action": "DISBURSEMENT_SENT",
      "details": {
        "amount": 25000,
        "recipient": "0xstudent...9abc"
      },
      "txHash": "0xghi789...",
      "timestamp": "2024-01-16T17:00:00.000Z"
    }
  ]
}
```

---

#### Log Activity

```http
POST /api/activities
```

**Request Body:**

```json
{
  "user": "0x1234...5678",
  "action": "APPLICATION_SUBMITTED",
  "details": {
    "applicationId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "amount": 50000
  },
  "txHash": "0xjkl012..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f4a5b6c7d8e9f0a1b2c3d4",
    "action": "APPLICATION_SUBMITTED",
    "timestamp": "2024-01-16T17:30:00.000Z"
  }
}
```

---

### Disbursements API

#### Create Disbursement

```http
POST /api/disbursements
```

**Request Body:**

```json
{
  "from": "0xadmin...1234",
  "to": "0xstudent...5678",
  "amount": 25000,
  "category": "TUITION",
  "applicationId": "64f1a2b3c4d5e6f7a8b9c0d1"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f5a6b7c8d9e0f1a2b3c4d5",
    "from": "0xadmin...1234",
    "to": "0xstudent...5678",
    "amount": 25000,
    "txHash": "0xmno345...",
    "status": "COMPLETED",
    "timestamp": "2024-01-16T18:00:00.000Z"
  }
}
```

---

#### Get Disbursements

```http
GET /api/disbursements
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | string | Filter by sender address |
| `to` | string | Filter by recipient address |
| `startDate` | string | Start date |
| `endDate` | string | End date |
| `minAmount` | number | Minimum amount |
| `maxAmount` | number | Maximum amount |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f5a6b7c8d9e0f1a2b3c4d5",
      "from": "0xadmin...1234",
      "to": "0xstudent...5678",
      "amount": 25000,
      "category": "TUITION",
      "txHash": "0xmno345...",
      "timestamp": "2024-01-16T18:00:00.000Z"
    }
  ],
  "summary": {
    "totalDisbursed": 1250000,
    "totalTransactions": 50,
    "byCategory": {
      "TUITION": 500000,
      "BOOKS": 200000,
      "HOSTEL": 300000
    }
  }
}
```

---

### Public Transparency API

#### Get Public Statistics

```http
GET /api/public/stats
```

**No authentication required**

**Response:**

```json
{
  "success": true,
  "data": {
    "totalFundsDistributed": 12500000,
    "totalStudents": 500,
    "totalVendors": 75,
    "totalTransactions": 3500,
    "fundsUtilization": {
      "TUITION": 5000000,
      "BOOKS": 2000000,
      "COURSES": 1500000,
      "CERTIFICATION": 1000000,
      "HOSTEL": 2000000,
      "TRANSPORT": 500000,
      "INTERNET": 500000
    },
    "monthlyTrend": [
      { "month": "2024-01", "amount": 1500000 },
      { "month": "2024-02", "amount": 1800000 }
    ]
  }
}
```

---

#### Get Public Transactions

```http
GET /api/public/transactions
```

**No authentication required** (returns anonymized data)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "txHash": "0xabc123...",
      "amount": 5000,
      "category": "BOOKS",
      "timestamp": "2024-01-16T10:00:00.000Z",
      "vendorCategory": "Stationery Store"
    }
  ]
}
```

---

## 🔴 Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid wallet address format",
    "details": [
      {
        "field": "studentAddress",
        "message": "Must be a valid Ethereum address"
      }
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `BLOCKCHAIN_ERROR` | 500 | Smart contract interaction failed |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 📊 Rate Limiting

| Endpoint Type | Rate Limit |
|---------------|------------|
| Public endpoints | 100 requests/minute |
| Authenticated endpoints | 500 requests/minute |
| Admin endpoints | 1000 requests/minute |

---

## 🔄 Webhooks

Configure webhooks to receive real-time notifications:

```http
POST /api/webhooks
```

**Request Body:**

```json
{
  "url": "https://your-server.com/webhook",
  "events": [
    "application.approved",
    "disbursement.completed",
    "vendor.whitelisted"
  ],
  "secret": "your-webhook-secret"
}
```

---

## 📝 SDK Examples

### Node.js

```javascript
const EduAidSDK = require('eduaid-sdk');

const client = new EduAidSDK({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.eduaid.org'
});

// Submit application
const application = await client.applications.create({
  studentAddress: '0x1234...5678',
  scholarshipType: 'TUITION',
  amount: 50000
});

// Get disbursements
const disbursements = await client.disbursements.list({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
```

### Python

```python
from eduaid import EduAidClient

client = EduAidClient(
    api_key='your-api-key',
    base_url='https://api.eduaid.org'
)

# Submit application
application = client.applications.create(
    student_address='0x1234...5678',
    scholarship_type='TUITION',
    amount=50000
)

# Get public stats
stats = client.public.get_stats()
```

---

## 📞 Support

For API support, contact:
- **Email:** api-support@eduaid.org
- **Discord:** https://discord.gg/eduaid-dev
