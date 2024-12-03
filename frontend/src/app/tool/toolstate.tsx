import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Deployment } from "../deployments/types";

interface ToolState {
  loading: boolean;
  prompt: string;
  progressLevel: number;
  reactCode: string | null;
  recommendations: Recommendation[];
  projectStates: ProjectState[];
  shouldShowToast: boolean;
  toastMessage: string;
  activeProjectState: ProjectState | null;
  hasUnreadIteration: boolean;
  hasError: boolean;

  showToast: (message: string) => void;
  setPrompt: (value: string) => void;
  removeToast: () => void;
  setReactCode: (code: string) => void;
  setLoading: (isLoading: boolean) => void;
  setProgressLevel: (value: number) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
  setProjectStates: (projectStates: ProjectState[]) => void;
  resetProject: () => void;
  removePrompt: (promptId: number) => void;
  setActiveProjectState: (projectState: ProjectState) => void;
  resetUnreadIterationState: () => void;
  setErrorState: (errorState: boolean) => void;
}

export const useToolStore = create<ToolState>()((set) => ({
  loading: false,
  prompt: "",
  recommendations: [],
  progressLevel: 5,
  projectStates: [],
  reactCode: null,
  shouldShowToast: false,
  toastMessage: "",
  activeProjectState: null,
  hasUnreadIteration: false,
  hasError: false,

  showToast: (message) =>
    set(() => ({ shouldShowToast: true, toastMessage: message })),
  setErrorState: (errorState: boolean) => set(() => ({ hasError: errorState })),
  resetProject: () =>
    set(() => ({
      prompts: [],
      projectStates: [],
      reactCode: null,
      recommendations: [],
      activeProjectState: null,
    })),
  setPrompt: (value) => set(() => ({ prompt: value })),
  setActiveProjectState: (projectState: ProjectState) =>
    set(() => ({ activeProjectState: projectState })),
  removeToast: () => set(() => ({ shouldShowToast: false })),
  setReactCode: (code) => set(() => ({ reactCode: code })),
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  setProgressLevel: (value: number) => set({ progressLevel: value }),
  setProjectStates: (projectStates: ProjectState[]) =>
    set(() => ({ projectStates: projectStates })),
  setRecommendations: (newRecommendations: Recommendation[]) => {
    set(() => ({
      recommendations: newRecommendations,
      hasUnreadIteration: true,
    }));
  },
  resetUnreadIterationState: () => {
    set(() => ({
      hasUnreadIteration: false,
    }));
  },
  removePrompt: (promptId: number) => {
    set((state) => ({
      projectStates: state.projectStates.filter((ps) => ps.id !== promptId),
    }));
  },
}));

export interface ProjectState {
  reactCode: string;
  messages: ProjectStateMessage[];
  id: number;
}

export interface ProjectStateMessage {
  content: string;
}

export type ProjectObj = {
  id: string;
  name: string;
};

interface Project {
  projects: ProjectObj[];
  setProjects: (projects: ProjectObj[]) => void;
  setFilteredProjects: (id: string, projects: ProjectObj[]) => void;
  projectIdStorage: string | null;
  setProjectIdStorage: (id: string) => string;
  projectName: string;
  setProjectName: (name: string) => void;
}

interface DeploymentState {
  deployments: Deployment[];
  deploymentName: string;
  passcode: string;
  projectStateId: number | null;
  modalOpen: boolean;

  setDeployments: (deployments: Deployment[]) => void;
  setFilteredDeployments: (id: string, deployments: Deployment[]) => void;
  setDeploymentName: (name: string) => void;
  setPasscode: (passcode: string) => void;
  setProjectStateId: (projectId: number) => void;
  setDeploymentModalOpen: (isOpen: boolean) => void;
}

export const useProjectStore = create<Project>()(
  persist(
    (set, get) => ({
      projects: [],
      projectIdStorage: null,
      projectName: "",
      setProjects: (projects) => set({ projects }),
      setFilteredProjects: (id, projects) =>
        set(() => {
          const filterProjects = projects?.filter((project) => {
            return project.id !== id;
          });
          return { projects: filterProjects };
        }),
      setProjectIdStorage: (id: string) => {
        set({ projectIdStorage: id });
        return id;
      },
      setProjectName: (name: string) => set({ projectName: name }),
    }),
    {
      name: "project-id-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
    },
  ),
);

export const useDeploymentStore = create<DeploymentState>()((set) => ({
  deployments: [],
  deploymentName: "",
  passcode: "",
  projectStateId: null,
  modalOpen: false,
  setDeployments: (deployments) => set(() => ({ deployments })),
  setFilteredDeployments: (id, deployments) =>
    set(() => {
      const filteredDeployments = deployments?.filter((deployment) => {
        return deployment.id !== id;
      });
      return { deployments: filteredDeployments };
    }),
  setDeploymentName: (deploymentName) =>
    set(() => ({ deploymentName: deploymentName })),
  setPasscode: (passcode) => set(() => ({ passcode: passcode })),
  setProjectStateId: (projectId) => set(() => ({ projectStateId: projectId })),
  setDeploymentModalOpen: (isOpen) => set(() => ({ modalOpen: isOpen })),
}));
