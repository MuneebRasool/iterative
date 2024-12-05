import StytchProvider from "./components/StytchProvider"
import { MantineProvider } from "@mantine/core"
import LayoutWrapper from "./components/LayoutWrapper"

import "@mantine/core/styles.css"
import "./globals.css"

export const metadata = {
    title: 'Iterative',
    description: 'AI-Powered React Code Generator',
  }
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <StytchProvider children>
        <html><body>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <LayoutWrapper children>
            {children}
          </LayoutWrapper>
        </MantineProvider>
        </body></html>
      </StytchProvider>
    )
  }
