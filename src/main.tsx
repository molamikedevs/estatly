import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ErrorBoundary } from "react-error-boundary"

import { ThemeProvider } from "@/components/theme/theme-provider.tsx"
import { Toaster } from "@/components/ui/sonner"
import "@/styles/index.css"
import App from "./App.tsx"
import ErrorFallback from "./components/layout/ErrorFallback.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace("/")}
    >
      <ThemeProvider>
        <App />
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
)
