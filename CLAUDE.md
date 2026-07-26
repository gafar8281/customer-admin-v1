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

### Mock credentials (development only)

| Field | Value |
|---|---|
| Email | `customer@email.com` |
| Password | `cust@123` |


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
| `payment` | enum (dropdown) | Billing cycle for rent. Options: Monthly, Half yearly, Yearly |

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
