import StytchProvider from "./components/StytchProvider"

export const metadata = {
    title: 'Next.js',
    description: 'Generated by Next.js',
  }
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <StytchProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
      </StytchProvider>
    )
  }