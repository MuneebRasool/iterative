import StytchProvider from "./components/StytchProvider"
import { MantineProvider, AppShell } from "@mantine/core"

export const metadata = {
    title: 'Iterative',
    description: 'AI-Powered React Code Generator',
  }
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AppShell>
            <StytchProvider children={children} >
              {children}
            </StytchProvider>
          </AppShell>
        </MantineProvider>
    )
  }