# Rental Property Management Backend Phase 1

This phase adds backend-only foundations for a generic rental property management workflow. It does not change the frontend, authentication behavior, deployment files, payment gateways, or messaging integrations.

## Added Models

### Owners

Collection: `Owners`

Stores property owner contact and payout configuration.

Key fields:

- `name`
- `phone`
- `whatsapp`
- `email`
- `payoutMethod`
- `commissionType`
- `commissionValue`
- `createBy`

### Rental Units

Collection: `RentalUnits`

Stores rental-specific unit inventory while leaving the existing `Properties` model intact.

Key fields:

- `name`
- `code`
- `property`
- `owner`
- `unitType`
- `bedrooms`
- `bathrooms`
- `maxGuests`
- `area`
- `address`
- `baseNightlyRate`
- `cleaningFee`
- `securityDeposit`
- `currency`
- `status`

### Reservations

Collection: `Reservations`

Stores booking/reservation records.

Key fields:

- `reservationCode`
- `unit`
- `guest`
- `owner`
- `checkInDate`
- `checkOutDate`
- `nights`
- `adults`
- `children`
- `source`
- `status`
- `subtotal`
- `discount`
- `cleaningFee`
- `securityDeposit`
- `totalAmount`
- `depositRequired`
- `depositPaid`
- `balanceDue`
- `paymentStatus`
- `depositDueDate`
- `cancellationReason`
- `internalNotes`
- `guestNotes`
- `createBy`

Reservation status values:

- `inquiry`
- `tentative`
- `confirmed`
- `checked_in`
- `checked_out`
- `cancelled`
- `no_show`

Critical rule:

A rental unit cannot have two `confirmed` reservations with overlapping date ranges. The backend validates this rule when creating or editing reservations.

### Rental Payments

Collection: `RentalPayments`

Stores manual payment, deposit, balance, refund, and owner payout records. This is not a payment gateway integration.

Key fields:

- `reservation`
- `guest`
- `unit`
- `owner`
- `amount`
- `currency`
- `type`
- `method`
- `status`
- `paymentDate`
- `dueDate`
- `referenceNumber`
- `proofImage`
- `collectedBy`
- `createBy`

### Seasonal Rates

Collection: `SeasonalRates`

Stores rental rate rules by unit and date range.

Key fields:

- `unit`
- `seasonName`
- `startDate`
- `endDate`
- `weekdayRate`
- `weekendRate`
- `weeklyRate`
- `monthlyRate`
- `minimumNights`
- `currency`
- `priority`
- `isActive`
- `createBy`

### Availability Blocks

Collection: `AvailabilityBlocks`

Stores non-reservation blocks such as owner use, maintenance, or manual blocks.

Key fields:

- `unit`
- `startDate`
- `endDate`
- `reason`
- `notes`
- `createBy`

## Added Routes

All routes are mounted under `/api` and use the existing `auth` middleware.

### Owners

- `GET /api/owner`
- `POST /api/owner/add`
- `GET /api/owner/view/:id`
- `PUT /api/owner/edit/:id`
- `DELETE /api/owner/delete/:id`
- `POST /api/owner/deleteMany`

### Rental Units

- `GET /api/rental-unit`
- `GET /api/rental-unit/availability`
- `POST /api/rental-unit/add`
- `GET /api/rental-unit/view/:id`
- `PUT /api/rental-unit/edit/:id`
- `DELETE /api/rental-unit/delete/:id`
- `POST /api/rental-unit/deleteMany`

### Reservations

- `GET /api/reservation`
- `GET /api/reservation/availability`
- `POST /api/reservation/add`
- `GET /api/reservation/view/:id`
- `PUT /api/reservation/edit/:id`
- `DELETE /api/reservation/delete/:id`
- `POST /api/reservation/deleteMany`

### Rental Payments

- `GET /api/rental-payment`
- `POST /api/rental-payment/add`
- `GET /api/rental-payment/view/:id`
- `PUT /api/rental-payment/edit/:id`
- `DELETE /api/rental-payment/delete/:id`
- `POST /api/rental-payment/deleteMany`

### Seasonal Rates

- `GET /api/seasonal-rate`
- `POST /api/seasonal-rate/add`
- `GET /api/seasonal-rate/view/:id`
- `PUT /api/seasonal-rate/edit/:id`
- `DELETE /api/seasonal-rate/delete/:id`
- `POST /api/seasonal-rate/deleteMany`

### Availability Blocks

- `GET /api/availability-block`
- `POST /api/availability-block/add`
- `GET /api/availability-block/view/:id`
- `PUT /api/availability-block/edit/:id`
- `DELETE /api/availability-block/delete/:id`
- `POST /api/availability-block/deleteMany`

## Local Testing Notes

1. Start MongoDB.
2. Copy `server/.env.example` to `server/.env` locally and fill any needed secrets. Do not commit `server/.env`.
3. Start the backend:

```bash
cd server
npm install
npm start
```

4. Login to get a token:

```bash
curl -X POST http://localhost:5001/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@gmail.com","password":"admin123"}'
```

Use the returned `token` value as the `Authorization` header in the examples below.

## Example API Checks

Create an owner:

```bash
curl -X POST http://localhost:5001/api/owner/add \
  -H "Authorization: TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Owner One","phone":"01000000000","createBy":"USER_ID_HERE"}'
```

Create a rental unit:

```bash
curl -X POST http://localhost:5001/api/rental-unit/add \
  -H "Authorization: TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Unit A","code":"UNIT-A","owner":"OWNER_ID_HERE","unitType":"apartment","maxGuests":4,"baseNightlyRate":2500,"createBy":"USER_ID_HERE"}'
```

Create a confirmed reservation:

```bash
curl -X POST http://localhost:5001/api/reservation/add \
  -H "Authorization: TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"reservationCode":"RES-001","unit":"UNIT_ID_HERE","guest":"CONTACT_ID_HERE","owner":"OWNER_ID_HERE","checkInDate":"2026-07-01","checkOutDate":"2026-07-05","adults":2,"children":1,"source":"direct","status":"confirmed","subtotal":10000,"discount":0,"cleaningFee":500,"securityDeposit":1000,"totalAmount":11500,"depositRequired":3000,"depositPaid":3000,"createBy":"USER_ID_HERE"}'
```

Confirm overlap validation:

```bash
curl -X POST http://localhost:5001/api/reservation/add \
  -H "Authorization: TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"reservationCode":"RES-002","unit":"UNIT_ID_HERE","guest":"CONTACT_ID_HERE","checkInDate":"2026-07-03","checkOutDate":"2026-07-06","status":"confirmed","totalAmount":9000,"createBy":"USER_ID_HERE"}'
```

Expected result: HTTP `409` because the date range overlaps an existing confirmed reservation for the same unit.

Check availability:

```bash
curl "http://localhost:5001/api/reservation/availability?unit=UNIT_ID_HERE&checkInDate=2026-07-10&checkOutDate=2026-07-12" \
  -H "Authorization: TOKEN_HERE"
```

Create a manual payment:

```bash
curl -X POST http://localhost:5001/api/rental-payment/add \
  -H "Authorization: TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"reservation":"RESERVATION_ID_HERE","guest":"CONTACT_ID_HERE","unit":"UNIT_ID_HERE","amount":3000,"type":"deposit","method":"cash","status":"paid","paymentDate":"2026-06-18","createBy":"USER_ID_HERE"}'
```

Create a seasonal rate:

```bash
curl -X POST http://localhost:5001/api/seasonal-rate/add \
  -H "Authorization: TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"unit":"UNIT_ID_HERE","seasonName":"Peak Season","startDate":"2026-07-01","endDate":"2026-08-31","weekdayRate":3000,"weekendRate":3500,"minimumNights":3,"createBy":"USER_ID_HERE"}'
```

Create an availability block:

```bash
curl -X POST http://localhost:5001/api/availability-block/add \
  -H "Authorization: TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"unit":"UNIT_ID_HERE","startDate":"2026-09-01","endDate":"2026-09-05","reason":"maintenance","notes":"Routine maintenance","createBy":"USER_ID_HERE"}'
```
