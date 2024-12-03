"use client";
import { useEffect, useState } from "react";
import Loading from "../components/loading";
import Link from "next/link";
import { BackendClient } from "../../../axios";
import { ProjectModal } from "../components/ProjectModal";
import { ProjectObj, useProjectStore } from "../tool/toolstate";
import { useDisclosure } from "@mantine/hooks";
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

export default function Projects() {
  const { projects, setFilteredProjects, setProjects } = useProjectStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [opened, { toggle }] = useDisclosure();
  // Trigger projects fetching on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    await BackendClient.get("projects")
      .then((response) => {
        setProjects(response.data.projects);
      })
      .catch((error) => {
        console.error("Error Fetching projects");
        setError("Error Fetching projects, please try again");
      });
    setLoading(false);
  };

  const handleDelete = async (project_id: string) => {
    setLoading(true);
    await BackendClient.delete("projects", { data: { project_id } })
      .then((response) => {
        // filter project from frontend if successfully deleted from backend
        setFilteredProjects(project_id, projects);
      })
      .catch((error) => {
        // set error so it can be displayed on the UI
        setError(error);
      });
    setLoading(false);
  };

  // Show loading spinner while projects are being fetched
  if (loading) return <Loading />;
  // Show error message if error is thrown by server
  if (error)
    return (
      <div className="h-[calc(100vh-10rem)] rounded-lg pt-10">
        <p aria-label="Error message" className="text-center text-xl">
          {error}
        </p>
      </div>
    );
  const items = projects.map((project: ProjectObj) => {
    return (
      <TableTr key={project.id}>
        <TableTd>{project.name}</TableTd>
        <TableTd>
          <Link
            className="underline text-blue-400"
            href={`/tool/${project.id}`}
          >
            Open in Tool
          </Link>
        </TableTd>
        <TableTd>
          <Button
            variant="filled"
            color="red"
            size={"xs"}
            onClick={() => handleDelete(project.id)}
          >
            Delete Project
          </Button>
        </TableTd>
      </TableTr>
    );
  });
  // Show projects table if projects are fetched correctly
  return (
    <AppShellMain>
      <div className="flex flex-col items-start">
        <ProjectModal projectId={null} opened={opened} onClose={toggle} />
        <Button className="mb-4" variant="filled" onClick={toggle}>
          New Project
        </Button>
        <Table withRowBorders={true}>
          <TableThead>
            <TableTr>
              <TableTh>Project Name</TableTh>
              <TableTh>Open Project</TableTh>
              <TableTh></TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>{items}</TableTbody>
        </Table>
      </div>
    </AppShellMain>
  );
}
