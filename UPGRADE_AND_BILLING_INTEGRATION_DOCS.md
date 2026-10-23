# 📑 UpBeat Africa — Billing & Subscription Prorated Upgrade API Documentation

---

## 🎯 ১. ওভারভিউ (Overview)
UpBeat Africa-তে সাবস্ক্রিপশন ইঞ্জিন এখন সম্পূর্ণ **Prorated Dynamic Upgrade Engine** সাপোর্ট করে।
- ব্যবহারকারী যেকোনো সময় তার বর্তমান সক্রিয় প্ল্যান থেকে উচ্চতর বা অন্য যেকোনো প্ল্যানে আপগ্রেড করতে পারবেন।
- বর্তমান প্ল্যানের অব্যবহৃত ব্যালেন্স (Unused Credit) দিন হিসেবে আনুপাতিক হারে হিসাব করে নতুন প্ল্যানের ফি থেকে স্বয়ংক্রিয়ভাবে বাদ দেওয়া হয়।
- যদি অব্যবহৃত ক্রেডিট নতুন প্ল্যানের সম্পূর্ণ মূল্য কভার করে, তবে গেটওয়েতে রিডাইরেক্ট না করে তাৎক্ষণিকভাবে প্ল্যান অ্যাক্টিভ হয়ে যাবে (`isInstantUpgrade: true`)।
- বাৎসরিক সাবস্ক্রিপশনের ক্ষেত্রে মেয়াদ স্বয়ংক্রিয়ভাবে ৩৬৫ দিন এবং মাসিকের ক্ষেত্রে ৩০ দিন হিসাব হবে।

---

## 🛣️ ২. API এন্ডপয়েন্টস (Endpoints)

| মেথড | এন্ডপয়েন্ট | বিবরণ | অথেন্টিকেশন |
| :--- | :--- | :--- | :--- |
| `GET` | `/subscriptions/v1/plans` | সকল সক্রিয় প্ল্যানের তালিকা | পাবলিক / ডিজে |
| `GET` | `/subscriptions/v1/my-subscription` | ডিজের বর্তমান সক্রিয় সাবস্ক্রিপশন | DJ (Bearer Token) |
| `GET` | `/subscriptions/v1/preview-upgrade` | আপগ্রেড ক্যালকুলেশন প্রিভিউ (Unused Credit & Net Payable) | DJ (Bearer Token) |
| `POST` | `/subscriptions/v1/subscribe` | সাবস্ক্রিপশন / আপগ্রেড শুরু করা | DJ (Bearer Token) |
| `POST` | `/subscriptions/v1/cancel` | সাবস্ক্রিপশন বাতিল ও পোর্টফোলিও অফলাইন করা | DJ (Bearer Token) |

---

## 🔍 ৩. আপগ্রেড প্রিভিউ API (`GET /subscriptions/v1/preview-upgrade`)

নতুন প্ল্যানে সুইচ করার আগে ফ্রন্টএন্ডে ইউজারকে স্পষ্ট হিসাব দেখানোর জন্য এই এন্ডপয়েন্টটি কল করতে হবে।

### রিকোয়েস্ট কুয়েরি প্যারামিটারস (Query Parameters):
- `planId` (number, required): যে প্ল্যানে ইউজার যেতে চান (e.g. `2`).
- `billingCycle` (enum, required): `'monthly'` অথবা `'annually'`.

### রিকোয়েস্ট উদাহরণ:
```http
GET /subscriptions/v1/preview-upgrade?planId=2&billingCycle=monthly
Authorization: Bearer <TOKEN>
```

### রেসপন্স ফরম্যাট (JSON):
```json
{
  "success": true,
  "message": "Subscription upgrade preview generated",
  "data": {
    "isUpgrade": true,
    "isSamePlanAndCycle": false,
    "isDowngrade": false,
    "downgradeMessage": null,
    "currentPlan": {
      "id": 1,
      "name": "Basic Plan",
      "billingCycle": "monthly",
      "pricePaid": 500,
      "periodEnd": "2026-11-18T10:00:00.000Z",
      "remainingDays": 25
    },
    "targetPlan": {
      "id": 2,
      "name": "Pro Plan",
      "billingCycle": "monthly",
      "price": 1500
    },
    "unusedCredit": 416.67,
    "appliedCredit": 416.67,
    "amountToPay": 1083.33,
    "currency": "KES"
  }
}
```

> **ফ্রন্টএন্ডে প্রদর্শনের নিয়ম (UI Rules)**:
> - যদি `isUpgrade === true`: আপগ্রেড মডালে প্রোরেশন ব্রেকডাউন দেখান (নতুন মূল্য, প্রোরেশন ছাড়, মোট প্রদেয়)।
> - যদি `isSamePlanAndCycle === true`: বাটনটি ডিসেবল রাখুন এবং দেখান `"Already Active"`।
> - যদি `isDowngrade === true`: বাটনটি ডিসেবল রাখুন এবং একটি ওয়ার্নিং টোস্ট/অ্যালার্টে `downgradeMessage` প্রদর্শন করুন (যেমন: *"You have an active Annual plan valid until [Date]. Downgrades are not permitted mid-cycle."*)।

---


## 🚀 ৪. সাবস্ক্রাইব / আপগ্রেড এক্সিকিউশন API (`POST /subscriptions/v1/subscribe`)

ইউজার যখন কনফার্ম করে সাবস্ক্রাইব বা আপগ্রেড বাটনে চাপ দেবেন:

### রিকোয়েস্ট বডি (Payload):
```json
{
  "planId": 2,
  "billingCycle": "monthly",
  "gateway": "paystack",
  "successUrl": "https://deejay.africa/dashboard/billing?success=true",
  "cancelUrl": "https://deejay.africa/dashboard/billing?canceled=true"
}
```

### রেসপন্স সিনারিও ক: পেইড আপগ্রেড / নতুন সাবস্ক্রিপশন (`amountToPay > 0`)
ইউজারকে গেটওয়ের চেকআউট পেজে রিডাইরেক্ট করতে হবে:
```json
{
  "success": true,
  "message": "Subscription process initiated",
  "data": {
    "url": "https://checkout.paystack.com/00xxyyzz...",
    "isUpgrade": true,
    "appliedCredit": 416.67,
    "amountToPay": 1083.33
  }
}
```
**ফ্রন্টএন্ড অ্যাকশন**: `window.location.href = response.data.url;`

---

### রেসপন্স সিনারিও খ: ইনস্ট্যান্ট আপগ্রেড (`amountToPay === 0`)
যদি ইউজারের অব্যবহৃত ক্রেডিট নতুন প্ল্যানের ফি সম্পূর্ণ কভার করে ফেলে (যেমন বাৎসরিক থেকে মাসিকে পরিবর্তন বা যথেষ্ট ব্যালেন্স থাকা):
```json
{
  "success": true,
  "message": "Subscription process initiated",
  "data": {
    "url": null,
    "isInstantUpgrade": true,
    "message": "Plan upgraded successfully using your remaining balance!"
  }
}
```
**ফ্রন্টএন্ড অ্যাকশন**:
- কোনো পেমেন্ট গেটওয়েতে রিডাইরেক্ট করার দরকার নেই।
- সরাসরি সাকসেস টোস্ট দেখান (`toast.success(response.data.message)`)।
- `refetchSub()` এবং `refetchTenant()` ট্রিগার করুন।

---

## 🔒 ৫. ট্রানজেকশন রোলব্যাক ও সিকিউরিটি গ্যারান্টি (Financial Safety)
1. **$transaction Rollback**:
   - Webhook ও পেমেন্ট প্রসেসিং সম্পূর্ণভাবে Prisma-র ইন্টারঅ্যাক্টিভ `$transaction`-এর ভেতরে ঘটে।
   - ইনভয়েস, ট্রানজেকশন, সাবস্ক্রিপশন পিরিয়ড এবং টেন্যান্ট প্রোফাইল সব একযোগে আপডেট হয়। কোনো কারণে একটি ধাপে সমস্যা হলে সম্পূর্ণ ডাটাবেজ অপারেশন স্বয়ংক্রিয়ভাবে রোলব্যাক হয়।
2. **Idempotency**:
   - একাধিকবার একই ওয়েবহুক কল হলেও পূর্বে প্রসেস হওয়া ইভেন্ট বা পেইড ইনভয়েস পুনরায় এক্সিকিউট বা মেয়াদ বৃদ্ধি করে না।
