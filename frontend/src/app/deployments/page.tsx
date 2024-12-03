"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Deployment } from "./types";
import Loading from "../components/loading";
import Link from "next/link";
import { BackendClient } from "../../../axios";
import { useDeploymentStore } from "../tool/toolstate";
import {
  AppShellMain,
  Button,
  Paper,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";

export default function Deployments() {
  const { deployments, setDeployments, setFilteredDeployments } =
    useDeploymentStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  axios.defaults.withCredentials = true;
  // Trigger deployments fetching on component mount
  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    await BackendClient.get("deployments")
      .then((response) => {
        setDeployments(response.data.deployments);
      })
      .catch((error) => {
        console.error("Error Fetching Deployments");
        setError("Error Fetching Deployments, please try again");
      });
    setLoading(false);
  };

  const handleDelete = async (deployment_id: string) => {
    setLoading(true);
    await BackendClient.delete("deployments", { data: { deployment_id } })
      .then((response) => {
        // filter deployment from frontend if successfully deleted from backend
        setFilteredDeployments(deployment_id, deployments);
      })
      .catch((error) => {
        // Handle the error
        console.log("error deployment: ", error);
        // set error so it can be displayed on the UI
        setError(error);
      });
    setLoading(false);
  };

  // Show error message if error is thrown by server
  if (error)
    return (
      <div className="h-[calc(100vh-16rem)] rounded-lg bg-slate-200 pt-10 dark:bg-slate-900">
        <p aria-label="Error message" className="text-center text-xl">
          {error}
        </p>
      </div>
    );
  // Show loading spinner while deployments are being fetched
  if (loading) return <Loading />;
  // Show deployments table if deployments are fetched correctly
  const items = deployments.map((deployment: Deployment) => {
    const { id, name, password } = deployment;
    return (
      <TableTr key={id}>
        <TableTd>{name}</TableTd>
        <TableTd>{password}</TableTd>
        <TableTd>
          <Link className="underline" href={`/deployments/${id}`}>
            Open Prototype
          </Link>
        </TableTd>
        <TableTd>
          <Button
            variant="filled"
            color="red"
            size={"xs"}
            onClick={() => handleDelete(id)}
          >
            Delete Prototype
          </Button>
        </TableTd>
      </TableTr>
    );
  });
  return (
    <AppShellMain>
      <div className="flex flex-col items-start">
        <Table>
          <TableThead>
            <TableTr>
              <TableTh>Prototype Name</TableTh>
              <TableTh>Passcode</TableTh>
              <TableTh>Access</TableTh>
              <TableTh />
            </TableTr>
          </TableThead>
          <TableTbody>{items}</TableTbody>
        </Table>
      </div>
    </AppShellMain>
  );
}
