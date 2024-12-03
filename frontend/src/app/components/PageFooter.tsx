import { Anchor, AppShellFooter, Button, Group } from "@mantine/core";
import { Image } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PageFooter() {
  const pathname = usePathname();
  const links = [
    { link: "/privacy", label: "Privacy Policy" },
    { link: "/terms-of-service", label: "Terms of Service" },
  ];

  const isDeployments = pathname.includes("/deployments/");

  const items = links.map((link) => (
    <Anchor<"a"> c="dimmed" key={link.label} href={link.link} size="sm">
      {link.label}
    </Anchor>
  ));
  return (
    <>
      <div className="flex w-full p-4">
        <Group className="ml-auto">
          {isDeployments ? (
            <Link href="/tool">
              <Button>Build with Iterative</Button>
            </Link>
          ) : (
            items
          )}
        </Group>
      </div>
    </>
  );
}
