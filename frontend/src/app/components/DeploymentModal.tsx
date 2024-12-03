"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
  TextInput,
} from "@mantine/core";
import { useDeploymentStore, useToolStore } from "../tool/toolstate";
import { BackendClient } from "../../../axios";
import { notifications } from "@mantine/notifications";
import { useStytchUser } from "@stytch/nextjs";
import Login from "./Login";

interface DeploymentModalProps {
  opened: boolean;
  onClose: () => void;
}
export const DeploymentModal = ({ opened, onClose }: DeploymentModalProps) => {
  const { passcode, deploymentName, setPasscode, setDeploymentName } =
    useDeploymentStore();

  const { user } = useStytchUser();
  const { activeProjectState } = useToolStore();

  const onCloseModal = () => {
    setDeploymentName("");
    setPasscode("");
    onClose();
  };

  const handleCreateDeployment = () => {
    BackendClient.post(`deployments`, {
      project_state_id: activeProjectState?.id,
      deployment_name: deploymentName,
      passcode: passcode,
    })
      .then((_) => {
        onCloseModal();
        notifications.show({
          title: "Prototype Created Successfully!",
          message: "Head over to the prototypes tab to see it in action!",
        });
      })
      .catch(() => {
        notifications.show({
          color: "red",
          title: "Something went wrong!",
          message: "Failed to create prototype",
        });
      });
  };

  const onSuccessfulLogin = () => {
    onClose();
    window.location.reload();
  };

  return (
    <>
      {user ? (
        <Modal opened={opened} size="md" onClose={onCloseModal}>
          <ModalHeader>
            <ModalTitle>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Create a New Prototype
              </h3>
            </ModalTitle>
          </ModalHeader>

          <ModalBody>
            <div className="flex flex-col gap-2">
              <TextInput
                label="Prototype Name"
                placeholder="My First Prototype"
                value={deploymentName}
                onChange={(event) => {
                  setDeploymentName(event.target.value);
                }}
              />
              <TextInput
                label="Password"
                placeholder="123456"
                value={passcode}
                onChange={(event) => {
                  setPasscode(event.target.value);
                }}
              />
              <Button className="mt-2" onClick={handleCreateDeployment}>
                Create Deployment
              </Button>
            </div>
          </ModalBody>
        </Modal>
      ) : (
        <Modal opened={opened} size="md" onClose={onClose}>
          <ModalBody>
            <div className="flex w-full justify-center">
              <Login onLoginSuccess={onSuccessfulLogin} />
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
