import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import '@primer/css/dist/primer.css'

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <AuthProvider>
      <App />
    </AuthProvider>
   </ErrorBoundary>
)
