import StytchProvider from "./components/StytchProvider"
import { MantineProvider } from "@mantine/core"
import LayoutWrapper from "./components/LayoutWrapper"

import "./globals.css"

export const metadata = {
    title: 'Iterative',
    description: 'AI-Powered React Code Generator',
  }
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <StytchProvider children>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
        >
          <LayoutWrapper children>
          </LayoutWrapper>
        </MantineProvider>
      </StytchProvider>
    )
  }
