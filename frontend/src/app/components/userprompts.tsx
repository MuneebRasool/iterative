"use client";

import {
  Drawer,
  Button,
  Card,
  Group,
  Text,
  Menu,
  ActionIcon,
  rem,
} from "@mantine/core";
import { Dots, Trash } from "tabler-icons-react";

import {
  ProjectState,
  useDeploymentStore,
  useToolStore,
} from "../tool/toolstate";
import { useState } from "react";
import { BackendClient } from "../../../axios";

interface UserPromptsProps {
  user: any;
  opened: boolean;
  toggle: () => void;
  projectStates: ProjectState[];
  onLoadClick: (projectState: ProjectState) => void;
}

const UserPrompts = ({
  user,
  projectStates,
  opened,
  toggle,
  onLoadClick,
}: UserPromptsProps) => {
  const { setProjectStateId, setDeploymentModalOpen } = useDeploymentStore();
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const { removePrompt } = useToolStore();

  const onSuccessfulLogin = () => {
    setShowLoginModal(false);
    window.location.reload();
  };

  const onCreateDeploymentClick = (projectStateId: number) => {
    if (!user) setShowLoginModal(true);
    else {
      setProjectStateId(projectStateId);
      setDeploymentModalOpen(true);
    }
  };

  const onRemovePromptClick = (projectStateId: number) => {
    BackendClient.delete("/projects/project_state", {
      data: { project_state_id: projectStateId },
    }).then((_) => {
      removePrompt(projectStateId);
    });
  };

  return (
    <Drawer opened={opened} onClose={toggle} title={"Design Journey"}>
      <Drawer.Body className="flex flex-col gap-4">
        {projectStates.map((p, idx) => (
          <Card key={idx} shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section inheritPadding py="xs">
              <Group justify="end">
                <Menu withinPortal position="bottom-end" shadow="sm">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray">
                      <Dots style={{ width: rem(16), height: rem(16) }} />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      onClick={() => onRemovePromptClick(p.id)}
                      leftSection={
                        <Trash style={{ width: rem(14), height: rem(14) }} />
                      }
                      color="red"
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Card.Section>
            <Text size="sm" c="dimmed" mb="6">
              {p.messages[0].content}
            </Text>
            <Group justify="space-around">
              <Button
                fullWidth
                mt="md"
                radius="md"
                onClick={() => onLoadClick(p)}
                variant="filled"
              >
                Load in Canvas
              </Button>
              {/* <Button
                  onClick={() => onRemovePromptClick(p.id)}
                  variant="filled"
                >
                  Delete
                </Button> */}
            </Group>
          </Card>
        ))}
      </Drawer.Body>
    </Drawer>
  );
};

export default UserPrompts;
