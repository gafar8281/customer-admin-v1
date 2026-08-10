import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./i18n"
import "./index.css"
import App from "./App.tsx"
import { AuthProvider } from "@/auth/AuthProvider"
import { AppDirection } from "@/i18n/AppDirection"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppDirection>
          <App />
        </AppDirection>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
