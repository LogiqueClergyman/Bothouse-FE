import { create } from "zustand";
import type { Agent } from "@/types";

interface AgentsState {
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  upsertAgent: (agent: Agent) => void;
}

export const useAgentsStore = create<AgentsState>()((set) => ({
  agents: [],
  setAgents: (agents) => set({ agents }),
  upsertAgent: (agent) =>
    set((state) => {
      const idx = state.agents.findIndex((a) => a.agent_id === agent.agent_id);
      if (idx === -1) return { agents: [...state.agents, agent] };
      const agents = [...state.agents];
      agents[idx] = agent;
      return { agents };
    }),
}));
