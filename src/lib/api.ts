import type {
  Agent,
  AgentStats,
  RegisterAgentRequest,
  RegisterAgentResponse,
  UpdateAgentRequest,
  LeaderboardParams,
  LeaderboardResponse,
  RoomFilters,
  RoomWithSeats,
  CreateRoomRequest,
  GameListParams,
  GameInstance,
  AgentGameStateView,
  ActionRequest,
  ActionResponse,
  GameLogResponse,
  Settlement,
  PlatformStats,
} from "@/types";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class BotTheHouseApi {
  constructor(
    private baseUrl: string,
    private token?: string,
    private agentKey?: string
  ) {}

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    if (this.agentKey) {
      headers["X-Agent-Key"] = this.agentKey;
    }
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      let code = "INTERNAL_ERROR";
      let message = res.statusText;
      try {
        const body = await res.json();
        code = body.error ?? code;
        message = body.message ?? message;
      } catch {}
      throw new ApiError(res.status, code, message);
    }
    if (res.status === 204) return undefined as T;
    return res.json();
  }

  // Auth
  async getNonce(wallet: string): Promise<{ nonce: string; expires_at: string }> {
    return this.request(`/api/v1/auth/nonce`, {
      method: "POST",
      body: JSON.stringify({ wallet }),
    });
  }

  async verify(wallet: string, signature: string): Promise<{ access_token: string; refresh_token: string; user_id: string }> {
    return this.request(`/api/v1/auth/verify`, {
      method: "POST",
      body: JSON.stringify({ wallet, signature }),
    });
  }

  async refresh(refreshToken: string): Promise<{ access_token: string }> {
    return this.request(`/api/v1/auth/refresh`, {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async logout(): Promise<void> {
    return this.request(`/api/v1/auth/logout`, { method: "POST" });
  }

  async getMe(): Promise<{ user_id: string; wallet: string }> {
    return this.request(`/api/v1/auth/me`);
  }

  // Agents
  async registerAgent(req: RegisterAgentRequest): Promise<RegisterAgentResponse> {
    return this.request(`/api/v1/agents/register`, {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async listAgents(): Promise<Agent[]> {
    const res = await this.request<{ agents: Agent[] }>(`/api/v1/agents`);
    return res.agents;
  }

  async getAgent(agentId: string): Promise<Agent> {
    return this.request(`/api/v1/agents/${agentId}`);
  }

  async updateAgent(agentId: string, req: UpdateAgentRequest): Promise<Agent> {
    return this.request(`/api/v1/agents/${agentId}`, {
      method: "PUT",
      body: JSON.stringify(req),
    });
  }

  async rotateKey(agentId: string): Promise<{ api_key: string }> {
    return this.request(`/api/v1/agents/${agentId}/rotate-key`, { method: "POST" });
  }

  async getAgentStats(agentId: string): Promise<AgentStats[]> {
    const res = await this.request<{ stats: AgentStats[] }>(`/api/v1/agents/${agentId}/stats`);
    return res.stats;
  }

  async getLeaderboard(params: LeaderboardParams): Promise<LeaderboardResponse> {
    const qs = new URLSearchParams();
    if (params.game_type) qs.set("game_type", params.game_type);
    if (params.sort_by) qs.set("sort_by", params.sort_by);
    if (params.period) qs.set("period", params.period);
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    if (params.offset !== undefined) qs.set("offset", String(params.offset));
    return this.request(`/api/v1/agents/leaderboard?${qs.toString()}`);
  }

  // Lobby
  async listRooms(filters: RoomFilters): Promise<RoomWithSeats[]> {
    const qs = new URLSearchParams();
    if (filters.game_type) qs.set("game_type", filters.game_type);
    if (filters.status) qs.set("status", filters.status);
    if (filters.limit !== undefined) qs.set("limit", String(filters.limit));
    if (filters.offset !== undefined) qs.set("offset", String(filters.offset));
    const res = await this.request<{ rooms: RoomWithSeats[]; total: number }>(`/api/v1/lobby/rooms?${qs.toString()}`);
    return res.rooms;
  }

  async getRoom(roomId: string): Promise<RoomWithSeats> {
    return this.request(`/api/v1/lobby/rooms/${roomId}`);
  }

  async createRoom(req: CreateRoomRequest): Promise<RoomWithSeats> {
    return this.request(`/api/v1/lobby/rooms`, {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async joinRoom(roomId: string, escrowTxHash: string): Promise<{ seat_number: number; room: RoomWithSeats }> {
    return this.request(`/api/v1/lobby/rooms/${roomId}/join`, {
      method: "POST",
      body: JSON.stringify({ escrow_tx_hash: escrowTxHash }),
    });
  }

  async leaveRoom(roomId: string): Promise<void> {
    return this.request(`/api/v1/lobby/rooms/${roomId}/leave`, { method: "POST" });
  }

  // Games
  async listGames(params: GameListParams): Promise<GameInstance[]> {
    const qs = new URLSearchParams();
    if (params.status) qs.set("status", params.status);
    if (params.game_type) qs.set("game_type", params.game_type);
    if (params.agent_id) qs.set("agent_id", params.agent_id);
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    if (params.offset !== undefined) qs.set("offset", String(params.offset));
    const res = await this.request<{ games: GameInstance[]; total: number }>(`/api/v1/games?${qs.toString()}`);
    return res.games;
  }

  async getGame(gameId: string): Promise<GameInstance> {
    return this.request(`/api/v1/games/${gameId}`);
  }

  async getGameState(gameId: string): Promise<AgentGameStateView> {
    return this.request(`/api/v1/games/${gameId}/state`);
  }

  async submitAction(gameId: string, req: ActionRequest): Promise<ActionResponse> {
    return this.request(`/api/v1/games/${gameId}/action`, {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async getGameLog(gameId: string): Promise<GameLogResponse> {
    return this.request(`/api/v1/games/${gameId}/log`);
  }

  // Settlement
  async getSettlement(gameId: string): Promise<Settlement> {
    return this.request(`/api/v1/settle/${gameId}`);
  }

  async getAgentSettlementHistory(agentId: string): Promise<Settlement[]> {
    const res = await this.request<{ settlements: Settlement[]; total: number }>(`/api/v1/settle/agent/${agentId}/history`);
    return res.settlements;
  }

  // Stats
  async getPlatformStats(): Promise<PlatformStats> {
    return this.request(`/api/v1/stats`);
  }

  // Spectate
  async spectateGame(gameId: string): Promise<import("@/types").SpectatorView> {
    return this.request(`/api/v1/games/${gameId}/spectate`);
  }
}

export function createApi(token?: string, agentKey?: string): BotTheHouseApi {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  return new BotTheHouseApi(baseUrl, token, agentKey);
}
