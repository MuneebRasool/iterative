import { Tooltip, UnstyledButton, Stack, rem, Badge } from "@mantine/core";
import { ArrowIteration, FilePencil } from "tabler-icons-react";
import classes from "./Sidebar.module.css";
import { useToolStore } from "../tool/toolstate";

interface NavbarLinkProps {
  icon: typeof ArrowIteration | typeof FilePencil;
  label: string;
  active?: boolean;
  onClick?(): void;
  notification?: boolean;
}

function NavbarLink({
  icon: Icon,
  label,
  active,
  onClick,
  notification,
}: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} />
        {notification ? (
          <Badge size="sm" circle>
            !
          </Badge>
        ) : null}
      </UnstyledButton>
    </Tooltip>
  );
}

interface SidebarProps {
  opened: boolean;
  onDesignJourneyClick: () => void;
  onPotentialIterationClick: () => void;
}

export const Sidebar = ({
  opened,
  onDesignJourneyClick,
  onPotentialIterationClick,
}: SidebarProps) => {
  const { resetUnreadIterationState, hasUnreadIteration } = useToolStore();
  const data = [
    {
      icon: FilePencil,
      label: "Design Journey",
      onClick: onDesignJourneyClick,
    },
    {
      icon: ArrowIteration,
      label: "Potential Iterations",
      onClick: onPotentialIterationClick,
    },
  ];

  const links = data.map((link, index) => {
    // Only notify for the potential iterations.
    const notification = index === 1 && hasUnreadIteration;
    return (
      <NavbarLink
        {...link}
        key={link.label}
        onClick={link.onClick}
        notification={notification}
      />
    );
  });

  return opened ? (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>
    </nav>
  ) : null;
};
