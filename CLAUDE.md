# CLAUDE.md — Customer Service Admin App: Employee & Shop Management

## Project Overview

Create a new **Customer Service Admin App** to manage of internal**employees** and **shops** (leased retail/office units). This feature introduces two independent, CRUD-based management modules within the admin app, plus mock data for local development and demos before a real backend is wired up.

---

## Feature 0: Admin Login

Simple login gate for the admin app — required before the Employee or Shop
sections are accessible.

### Capabilities
- Login form (email + password)
- Session persistence (stay logged in on refresh)
- Logout

### Credentials

Credentials live in the Firestore `customer_user` collection (`email`, `password`,
`createdAt`) — one document per admin user, email stored lowercase. There are no
credentials in the bundle, so the password can be rotated from the Firebase Console
without a redeploy.

Because the security rules require `request.auth != null`, the login handler calls
`ensureAnonymousAuth()` (`src/lib/firebase.ts`) to establish an anonymous Firebase Auth
session before reading the collection. Anonymous sign-in must stay enabled in the
Console.

---

## Feature 1: Employee Management

### Capabilities
- **Add** a new employee record
- **Update** an existing employee record
- **Delete** an employee record
- List / view all employees

### Fields

| Field | Type | Notes |
|---|---|---|
| `employeeName` | string | Full name |
| `nationalId` | string | National ID / Iqama number. Treat as sensitive — mask in list views, show in detail/edit view only |
| `nationality` | string | Country of nationality |
| `laborExpense` | number (SAR) | Monthly labor cost associated with the employee |
| `saudization` | number (SAR) | Saudization-related cost/contribution (Nitaqat) tied to the employee |

---

## Feature 2: Shop Management

### Capabilities
- **Add** a new shop record
- **Update** / manage an existing shop record
- List / view all shops

### Fields

| Field | Type | Notes |
|---|---|---|
| `shopName` | string | Name/identifier of the shop |
| `amount` | number | General amount field — confirm exact meaning (e.g. shop valuation, deposit, or total contract value) during implementation |
| `shopLeaseExpiryDate` | date | Lease expiry date — used to flag upcoming/overdue renewals |
| `rentAmount` | number (SAR) | Recurring rent amount |
| `payment` | enum (dropdown) | Billing cycle for rent. Options: Monthly, Quarterly, Half yearly, Yearly |

---

## Feature 3: Rental Management

### Capabilities
- **Add** a new rental record
- **Update** an existing rental record
- **Delete** a rental record
- List / view all rentals

### Fields

| Field | Type | Notes |
|---|---|---|
| `apartmentNumber` | string | Apartment/unit identifier |
| `tenantName` | string | Full name of the tenant |
| `leaseExpiryDate` | date | Lease expiry date — used to flag upcoming/overdue renewals |
| `totalAmount` | number (SAR) | Total contract value for the lease |
| `paidAmount` | number (SAR) | Amount paid so far by the tenant |
| Remaining Balance | number (SAR), derived | `totalAmount - paidAmount`. Not stored — computed on read/render so it can never drift out of sync. Validation enforces `paidAmount <= totalAmount` |

---

## Feature 4: Debt Management

### Capabilities
- **Add** a new debt record
- **Update** an existing debt record
- **Delete** a debt record
- List / view all debts

### Fields

| Field | Type | Notes |
|---|---|---|
| `customer` | string | Name of the customer the company owes money to |
| `note` | string (optional) | Free-text note on what the debt is for |
| `debtWeOwe` | number (SAR) | Amount the company owes the customer |

---

## Feature 5: Expense Management

Monthly operating expenses, grouped by month (e.g. **May 2026**). Adding a month
creates a record; opening a month displays and manages its individual expense
entries.

### Capabilities
- **Add** a new month record (year + month; one record per calendar month)
- Open a month to **add, edit, and delete** its expense entries
- List / view all months, with total disbursed per month

### Fields

**Month** (`customer_expenses/{YYYY-MM}`)

| Field | Type | Notes |
|---|---|---|
| `year` | number | |
| `month` | number | 1–12 |

**Expense entry** (`customer_expenses/{YYYY-MM}/expense_entries/{id}`)

| Field | Type | Notes |
|---|---|---|
| `statement` | string | What the expense was for |
| `date` | date | Must fall within the parent month |
| `amountDisbursed` | number (SAR) | |

### Storage — nested Firestore

Stored as a subcollection, not a flat collection: the document ID of each month
record is its `YYYY-MM` key (e.g. `2026-05`), which both enforces one record per
month and gives entries a natural parent scope. Month totals are read via a
`collectionGroup` query over `expense_entries`, so `firestore.rules` needs a
collection-group rule for that subcollection name in addition to the app's
catch-all document rule.

```
customer_expenses (collection)
└── "2026-05" (document, id = YYYY-MM)
     ├── year: 2026
     ├── month: 5
     └── expense_entries (subcollection)
          └── {autoId} { statement, date, amountDisbursed, createdAt, updatedAt }
```

---

## Mock Data

Until a real backend/database is connected, the feature should ship with local mock
data so both sections are fully browsable and testable in the UI.

**Suggested approach:**
- `mock/employees.js` — 8–10 sample employee records covering a mix of nationalities
- `mock/shops.js` — 5–8 sample shop records, including at least:
  - one shop with an expired lease
  - one shop with a lease expiring soon (next 30 days)
  - one shop with a healthy/far-out lease date
  - a mix of payment values (Monthly, Half yearly, Yearly) across records

Mock data should live behind a simple data-access layer (e.g. `getEmployees()`,
`getShops()`) so it can later be swapped for real API/Firestore calls without
touching UI components.

---

## Suggested Data Model (draft)

```js
// Employee
{
  id: string,
  employeeName: string,
  nationalId: string,
  nationality: string,
  laborExpense: number,   // SAR
  saudization: number,    // SAR
  createdAt: string,
  updatedAt: string
}

// Shop
{
  id: string,
  shopName: string,
  amount: number,
  shopLeaseExpiryDate: string, // ISO date
  rentAmount: number,          // SAR
  payment: 'Monthly' | 'Half yearly' | 'Yearly',
  createdAt: string,
  updatedAt: string
}
```

---

## Tech Stack

- **Build tool:** Vite
- **Framework:** React.js
- **UI components:** shadcn/ui (Radix-based), styled with Tailwind CSS
- **Data layer:** Mock data module for now (see Mock Data section above), designed
  to be swapped for a real API/database later without touching UI components
- **Forms/validation:** Not yet decided — a natural fit is `react-hook-form` +
  `zod`, since shadcn/ui's form primitives are built around them
