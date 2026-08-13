import { Navigate, Route, Routes } from "react-router-dom"

import { ProtectedRoute } from "@/auth/ProtectedRoute"
import { AppLayout } from "@/components/layout/AppLayout"
import { LoginPage } from "@/pages/LoginPage"
import { EmployeesPage } from "@/pages/EmployeesPage"
import { ShopsPage } from "@/pages/ShopsPage"
import { RentalsPage } from "@/pages/RentalsPage"
import { DebtsPage } from "@/pages/DebtsPage"
import { ReceivablesPage } from "@/pages/ReceivablesPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/employees" replace />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="shops" element={<ShopsPage />} />
          <Route path="rentals" element={<RentalsPage />} />
          <Route path="debts" element={<DebtsPage />} />
          <Route path="receivables" element={<ReceivablesPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
