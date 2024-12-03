"use client";
import React, { useCallback } from "react";
import { RecommendationsList } from "../components/RecommendationsList";
import { useEffect } from "react";
import PromptBox from "../components/userprompts";
import PromptInput from "../components/promptinput";
import { useStytchUser } from "@stytch/nextjs";
import { DeploymentModal } from "../components/DeploymentModal";
import { ProjectModal } from "../components/ProjectModal";
import { BackendClient } from "../../../axios";
import { LiveCodeEditor } from "../components/LiveCodeEditor";
import { convertCode } from "../actions/actions";
import { ToolNavbar } from "../components/ToolNavbar";
import { AppShellMain, AppShellNavbar, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Sidebar } from "../components/Sidebar";
import { GenerationProgressbar } from "../components/GenerationProgressbar";
import { PromptSuggestions } from "../components/PromptSuggestions";
import { ProjectState, useProjectStore, useToolStore } from "../tool/toolstate";
import { socket } from "../socket";

export const Tool = () => {
  const {
    loading,
    setLoading,
    setProjectStates,
    projectStates,
    reactCode,
    setReactCode,
    recommendations,
    setRecommendations,
    resetProject,
    setPrompt,
    activeProjectState,
    setActiveProjectState,
    hasError,
    setErrorState,
  } = useToolStore();

  const [openedDesignJourney, { toggle: toggleDesignJourney }] =
    useDisclosure();
  const [openedIterations, { toggle: toggleIterations }] = useDisclosure();
  const [openSaveProject, { toggle: toggleSaveProject }] = useDisclosure();
  const [openShareProject, { toggle: toggleShareProject }] = useDisclosure();

  const { setProjectIdStorage } = useProjectStore();

  const projectIdStorage = useProjectStore((state) => state.projectIdStorage);

  const { user } = useStytchUser();

  useEffect(() => {
    socket.connect();
    createProject();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const refreshProjectStates = (projectId: string | null) => {
      BackendClient.post(
        `projects/project_state`,
        { project_id: projectId },
        { headers: { "Content-Type": "application/json" } },
      ).then(async (response: any) => {
        const projectStates = response.data.project_states;
        setProjectStates(projectStates);
        if (projectStates.length > 0) {
          setActiveProjectState(projectStates[projectStates.length - 1]);
        }
      });
    };

    const refreshRecommendations = (projectId: string | null) => {
      BackendClient.get(`recommendations?project_id=${projectId}`).then(
        (response) => {
          setRecommendations(response.data.recommendations);
        },
      );
    };

    const onServerCode = () => {
      setLoading(false);
      refreshProjectStates(projectIdStorage);
      setPrompt("");
    };

    const onServerRecommendation = () => {
      refreshRecommendations(projectIdStorage);
    };

    refreshRecommendations(projectIdStorage);
    refreshProjectStates(projectIdStorage);

    socket.on("server_recommendation", onServerRecommendation);
    socket.on("server_code", onServerCode);
    return () => {
      socket.off("server_recommendation", onServerRecommendation);
      socket.off("server_code", onServerCode);
    };
  }, [projectIdStorage]);

  useEffect(() => {
    const convertCodeFromServer = async () => {
      if (activeProjectState !== null) {
        const code = activeProjectState.reactCode;
        try {
          const convertedCode = await convertCode(code);
          setReactCode(convertedCode);
        } catch {
          setErrorState(true);
        }
      }
    };
    convertCodeFromServer();

    return () => {};
  }, [activeProjectState]);

  function createProject() {
    BackendClient.post(
      `projects`,
      { project_id: projectIdStorage },
      { headers: { "Content-Type": "application/json" } },
    )
      .then((response) => {
        setProjectIdStorage(response.data.project.id);
      })
      .catch((err) => {
        console.log("Failed to create project");
      });
  }

  async function onResetProject() {
    await BackendClient.post(
      `projects/reset`,
      { project_id: projectIdStorage },
      { headers: { "Content-Type": "application/json" } },
    );
    resetProject();
  }

  const handleSend = (prompt: string) => {
    console.log("Sending");
    console.log(socket);
    setLoading(true);
    socket.emit("user_message", {
      description: prompt,
      project_id: projectIdStorage,
    });
  };

  const onLoadClick = (projectState: ProjectState) => {
    setActiveProjectState(projectState);
    toggleDesignJourney();
  };

  return (
    <AppShellMain>
      <DeploymentModal opened={openShareProject} onClose={toggleShareProject} />
      <ProjectModal
        projectId={projectIdStorage}
        opened={openSaveProject}
        onClose={toggleSaveProject}
      />

      <RecommendationsList
        recommendations={recommendations}
        toggle={toggleIterations}
        opened={openedIterations}
      />

      <PromptBox
        user={user}
        opened={openedDesignJourney}
        toggle={toggleDesignJourney}
        onLoadClick={onLoadClick}
        projectStates={projectStates}
      />

      <AppShellNavbar>
        <Sidebar
          opened={activeProjectState !== null}
          onDesignJourneyClick={toggleDesignJourney}
          onPotentialIterationClick={toggleIterations}
        />
      </AppShellNavbar>
      <div className="flex flex-col gap-4 p-4 h-[80vh]">
        <div className="flex flex-col gap-8 grow items-center justify-center">
          {activeProjectState ? (
            <div className="flex flex-col grow w-full bg-gray-50 rounded-lg p-3 gap-3 self-stretch">
              <ToolNavbar
                handleProjectClear={onResetProject}
                onSaveClick={toggleSaveProject}
                onShareClick={toggleShareProject}
                prompt={activeProjectState.messages[0].content}
              />
              {loading ? (
                <GenerationProgressbar />
              ) : (
                <LiveCodeEditor code={reactCode} />
              )}
            </div>
          ) : loading ? (
            <GenerationProgressbar />
          ) : null}

          <div className="z-40 w-full flex justify-center origin-bottom items-center">
            <PromptInput
              loading={loading}
              user={user}
              onProjectReset={onResetProject}
              onPromptSubmit={handleSend}
            />
          </div>
          {activeProjectState ? null : <PromptSuggestions />}
        </div>
      </div>
    </AppShellMain>
  );
};
