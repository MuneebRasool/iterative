"use client";
import { AppShell } from "@mantine/core";
import { usePathname } from "next/navigation";
import AppNavbar from "./navbar";
import PageFooter from "./PageFooter";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <>
      {pathname === "/tool" ? (
        <AppShell
          withBorder={false}
          header={{ height: 60 }}
          navbar={{
            width: 50,
            breakpoint: "sm",
            collapsed: { mobile: true },
          }}
          footer={{ height: 50 }}
          padding="md"
        >
          <AppNavbar />
          {children}
          <PageFooter />
        </AppShell>
      ) : (
        <AppShell
          withBorder={false}
          header={{ height: 60 }}
          footer={{ height: 50 }}
          padding="md"
        >
          <AppNavbar />
          {children}
          <PageFooter />
        </AppShell>
      )}
    </>
  );
}
