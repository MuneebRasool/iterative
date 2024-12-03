"use client";

import { useEffect, useState } from "react";
import { Deployment } from "../types";
import { PasscodeModal } from "@/app/components/PasscodeModal";
import { BackendClient } from "../../../../axios";
import { LiveCodeEditor } from "@/app/components/LiveCodeEditor";
import { convertCode } from "@/app/actions/actions";
import { AppShellMain } from "@mantine/core";

export default function DeploymentView({ params }: { params: { id: string } }) {
  const deploymentId = params.id;

  const [loading, setLoading] = useState(false);

  const [convertedCode, setConvertedCode] = useState<string | null>(null);

  const [openPasswordCollection, setOpenPasswordCollection] = useState(false);
  const [invalidPasscode, setInvalidPasscode] = useState(false);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = () => {
    BackendClient.get(`deployments/${deploymentId}`)
      .then((response) => {
        setLoading(false);
        convertCodeForDeployment(response.data.deployment);
      })
      .catch((error) => {
        setOpenPasswordCollection(true);
        console.error(
          "Unauthenticated Deployment - showing Modal to collect password",
        );
      });
  };

  const convertCodeForDeployment = async (deployment: Deployment) => {
    const result = await convertCode(deployment.react_code);
    setConvertedCode(result);
  };

  const verifyPassword = (passcode: string) => {
    BackendClient.get(`deployments/${deploymentId}?passcode=${passcode}`)
      .then((response) => {
        setLoading(false);
        setOpenPasswordCollection(false);
        convertCodeForDeployment(response.data.deployment);
      })
      .catch((error) => {
        setInvalidPasscode(true);
        setOpenPasswordCollection(true);
        console.error("Passcode validation failed. Re-opening modal");
      });
  };

  return (
    <AppShellMain>
      {openPasswordCollection ? (
        <PasscodeModal
          isOpen={openPasswordCollection}
          onPasswordSubmit={verifyPassword}
          invalidPasscode={invalidPasscode}
        />
      ) : null}
      <div className="items stretch h-screen min-h-screen grow rounded-md">
        <LiveCodeEditor code={convertedCode} />
      </div>
    </AppShellMain>
  );
}
