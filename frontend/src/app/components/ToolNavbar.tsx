import { ActionIcon, Button, Menu, Paper, rem } from "@mantine/core";
import { Dots, Trash } from "tabler-icons-react";

interface ToolbarNavbarProps {
  prompt: string;
  handleProjectClear: () => void;
  onSaveClick: () => void;
  onShareClick: () => void;
}
export const ToolNavbar = ({
  handleProjectClear,
  onSaveClick,
  onShareClick,
  prompt,
}: ToolbarNavbarProps) => {
  return (
    <>
      <div className="flex items-center gap-8 justify-center items-center">
        <div className="flex flex-wrap items-center flex-1 w-full justify-start flex-initial text-sm text-ellipsis">
          <Paper p="sm" shadow="xs" radius="xl" withBorder>
            {prompt}
          </Paper>
        </div>
        <div className="flex flex-1 items-center gap-2 w-full w-auto ml-auto ">
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <Dots style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <Trash style={{ width: rem(14), height: rem(14) }} />
                }
                color="red"
                onClick={handleProjectClear}
              >
                Clear Project
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Button variant="outline" onClick={onSaveClick}>
            Save
          </Button>
          <Button variant="filled" onClick={onShareClick}>
            Share
          </Button>
        </div>
      </div>
    </>
  );
};
