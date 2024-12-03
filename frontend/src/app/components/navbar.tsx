"use client";
import { useCallback } from "react";

import Link from "next/link";
import { useStytchUser, useStytch } from "@stytch/nextjs";
import { Navbar } from "flowbite-react";
import { Button } from "@mantine/core";
import { usePathname } from "next/navigation";
import { AppShell } from "@mantine/core";

export default function AppNavbar() {
  const { user } = useStytchUser();
  const stytchClient = useStytch();

  const handleLogout = useCallback(() => {
    stytchClient.session.revoke();
  }, [stytchClient]);

  const isAuthenticated = user !== null;

  return (
    <AppShell.Header withBorder={false}>
      <Navbar fluid>
        <Navbar.Brand href="/">
          <img
            src="/iterative-logo.png"
            className="mr-3 h-12"
            alt="Iterative Logo"
          />
        </Navbar.Brand>
        <div className="flex md:order-2">
          {isAuthenticated ? (
            <Button
              variant="outline"
              component={Link}
              onClick={handleLogout}
              href=""
            >
              Sign Out
            </Button>
          ) : (
            <Button component={Link} href="/login">
              Sign up
            </Button>
          )}
          {isAuthenticated ? (
            <Navbar.Toggle className="sm:hidden ml-2" />
          ) : null}
        </div>
        <Navbar.Collapse>
          {isAuthenticated ? (
            <>
              <Navbar.Link href="/tool">Build</Navbar.Link>
              <Navbar.Link href="/projects">Projects</Navbar.Link>
              <Navbar.Link href="/deployments">Prototypes</Navbar.Link>
            </>
          ) : null}
        </Navbar.Collapse>
      </Navbar>
    </AppShell.Header>
  );
}
