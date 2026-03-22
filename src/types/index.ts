export type AgentStatus = "active" | "paused" | "suspended" | "deleted";
export type GameStatus = "waiting" | "in_progress" | "completed" | "cancelled";
export type PlayerStatus = "active" | "folded" | "all_in" | "busted" | "disconnected";
export type RoomStatus = "open" | "starting" | "in_progress" | "completed" | "cancelled";
export type SettlementStatus = "pending" | "submitted" | "confirmed" | "failed";

export interface Agent {
  agent_id: string;
  user_id: string;
  wallet_address: string;
  name: string;
  description?: string;
  webhook_url?: string;
  status: AgentStatus;
  created_at: string;
  updated_at: string;
  last_seen_at?: string;
}

export interface AgentPublic {
  agent_id: string;
  name: string;
  wallet_address: string;
  status: AgentStatus;
  created_at: string;
}

export interface AgentStats {
  agent_id: string;
  game_type: string;
  games_played: number;
  games_won: number;
  total_wagered_wei: string;
  total_won_wei: string;
  total_lost_wei: string;
  net_profit_wei: string;
  win_rate: number;
  updated_at: string;
}

export interface Room {
  room_id: string;
  game_type: string;
  game_version: string;
  status: RoomStatus;
  buy_in_wei: string;
  max_players: number;
  min_players: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface Seat {
  seat_id: string;
  room_id: string;
  agent_id: string;
  wallet_address: string;
  seat_number: number;
  joined_at: string;
  escrow_tx_hash?: string;
  escrow_verified: boolean;
}

export interface RoomWithSeats extends Room {
  seats: Seat[];
}

export interface GameInstance {
  game_id: string;
  room_id: string;
  game_type: string;
  game_version: string;
  status: GameStatus;
  sequence_number: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface GameLogEntry {
  game_id: string;
  sequence: number;
  timestamp: string;
  agent_id?: string;
  action: string;
  amount_wei?: string;
  state_hash: string;
}

export interface WinnerEntry {
  agent_id: string;
  wallet_address: string;
  amount_won_wei: string;
}

export interface LoserEntry {
  agent_id: string;
  wallet_address: string;
  amount_lost_wei: string;
}

export interface GameResult {
  game_id: string;
  winners: WinnerEntry[];
  losers: LoserEntry[];
  rake_wei: string;
  rake_rate_bps: number;
  signed_result_hash: string;
}

export interface Settlement {
  settlement_id: string;
  game_id: string;
  status: SettlementStatus;
  tx_hash?: string;
  block_number?: number;
  confirmed_at?: string;
  retry_count: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformStats {
  total_agents: number;
  games_in_progress: number;
  total_volume_wei: string;
}

export interface LeaderboardEntry {
  rank: number;
  agent: AgentPublic;
  stats: AgentStats;
}

export interface SpectatorPlayer {
  agent_id: string;
  name: string;
  seat_number: number;
  stack_wei: string;
  status: PlayerStatus;
  last_action?: string;
}

export interface SpectatorView {
  game_id: string;
  game_type: string;
  status: GameStatus;
  sequence_number: number;
  turn_number: number;
  visible_state: Record<string, unknown>;
  players: SpectatorPlayer[];
}

export interface AgentGameStateView {
  game_id: string;
  game_type: string;
  status: GameStatus;
  sequence_number: number;
  your_turn: boolean;
  turn_number: number;
  turn_expires_at?: string;
  timeout_action: string;
  visible_state: Record<string, unknown>;
  valid_actions: string[];
  wallet: {
    escrowed_wei: string;
    at_stake_wei: string;
  };
}

export interface GameLogResponse {
  game_id: string;
  log: GameLogEntry[];
  result?: GameResult;
}

export interface ActionRequest {
  action: string;
  amount_wei?: string;
  turn_number: number;
  signature: string;
}

export interface ActionResponse {
  accepted: boolean;
  sequence_number: number;
}

export interface RegisterAgentRequest {
  name: string;
  wallet_address: string;
  description?: string;
  webhook_url?: string;
}

export interface RegisterAgentResponse {
  agent_id: string;
  api_key: string;
  wallet_address: string;
  name: string;
  created_at: string;
}

export interface UpdateAgentRequest {
  name?: string;
  description?: string;
  webhook_url?: string;
  status?: "active" | "paused";
}

export interface CreateRoomRequest {
  game_type: string;
  buy_in_wei: string;
  max_players: number;
  min_players: number;
  escrow_tx_hash: string;
}

export interface RoomFilters {
  game_type?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface GameListParams {
  status?: string;
  game_type?: string;
  agent_id?: string;
  limit?: number;
  offset?: number;
}

export interface LeaderboardParams {
  game_type?: string;
  sort_by?: "win_rate" | "net_profit_wei" | "games_played";
  period?: "all_time" | "weekly" | "monthly";
  limit?: number;
  offset?: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total: number;
}
