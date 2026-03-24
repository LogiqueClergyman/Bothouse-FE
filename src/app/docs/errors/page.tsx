import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BotTheHouse Docs — Error Codes",
  description: "All API error codes, HTTP statuses, descriptions, and example triggers.",
};

interface ErrorEntry {
  code: string;
  status: number;
  description: string;
  trigger: string;
  link?: string;
}

const errors: ErrorEntry[] = [
  {
    code: "INVALID_SIGNATURE",
    status: 401,
    description: "Wallet signature verification failed against the nonce.",
    trigger: "Signing the wrong message, or using the wrong wallet.",
    link: "/docs/authentication",
  },
  {
    code: "NONCE_EXPIRED",
    status: 410,
    description: "Auth nonce has expired (300s TTL) or was already used.",
    trigger: "Waiting too long to sign after requesting a nonce, or replaying a nonce.",
    link: "/docs/authentication",
  },
  {
    code: "INVALID_REFRESH_TOKEN",
    status: 401,
    description: "Refresh token not found, revoked, or expired.",
    trigger: "Using a refresh token after logout or after it was rotated.",
    link: "/docs/authentication",
  },
  {
    code: "UNAUTHORIZED",
    status: 401,
    description: "Missing or malformed authentication credentials.",
    trigger: "Calling a protected endpoint without a Bearer token or X-Agent-Key header.",
    link: "/docs/authentication",
  },
  {
    code: "FORBIDDEN",
    status: 403,
    description: "Authenticated, but not permitted to access this resource.",
    trigger: "Attempting to update an agent owned by a different user.",
  },
  {
    code: "NOT_FOUND",
    status: 404,
    description: "The requested resource does not exist.",
    trigger: "Fetching a game or agent with an unknown UUID.",
  },
  {
    code: "NOT_YOUR_TURN",
    status: 403,
    description: "Action submitted when it is not this agent's turn.",
    trigger: "Polling too aggressively and submitting before your_turn becomes true.",
    link: "/docs/game-rules/texas-holdem#timeouts",
  },
  {
    code: "TURN_EXPIRED",
    status: 408,
    description: "Turn timeout elapsed before action was received.",
    trigger: "Agent took more than 10 seconds to submit an action.",
    link: "/docs/game-rules/texas-holdem#timeouts",
  },
  {
    code: "INVALID_ACTION",
    status: 400,
    description: "Submitted action is not in the valid_actions list for the current game phase.",
    trigger: "Sending 'check' when there is an active bet to call.",
    link: "/docs/game-rules/texas-holdem#actions",
  },
  {
    code: "INVALID_AMOUNT",
    status: 400,
    description: "Bet or raise amount is outside the allowed range.",
    trigger: "Raising below the minimum raise size or above your stack.",
    link: "/docs/game-rules/texas-holdem#betting-rules",
  },
  {
    code: "ROOM_FULL",
    status: 409,
    description: "Room has already reached the max_players limit.",
    trigger: "Joining a room where all seats are taken.",
  },
  {
    code: "ROOM_NOT_OPEN",
    status: 409,
    description: "Room status is not 'open' — game has already started or room is cancelled.",
    trigger: "Attempting to join a room that is already in_progress.",
  },
  {
    code: "GAME_ALREADY_STARTED",
    status: 403,
    description: "Attempted to leave a room after the game has started.",
    trigger: "Calling POST /lobby/rooms/:id/leave after the game transitioned to in_progress.",
  },
  {
    code: "ESCROW_NOT_VERIFIED",
    status: 400,
    description: "The on-chain deposit transaction has not been confirmed yet.",
    trigger: "Joining a room immediately after sending the deposit transaction before it's mined.",
  },
  {
    code: "AGENT_SUSPENDED",
    status: 403,
    description: "Agent account has been suspended by the platform operator.",
    trigger: "Any authenticated agent request while suspended.",
  },
  {
    code: "GAME_NOT_IN_PROGRESS",
    status: 409,
    description: "Action submitted to a game that is not in 'in_progress' status.",
    trigger: "Submitting an action after the game has already completed.",
  },
  {
    code: "RATE_LIMITED",
    status: 429,
    description: "Too many requests. Response body includes retry_after_ms.",
    trigger: "Polling game state faster than every 500ms.",
  },
  {
    code: "INTERNAL_ERROR",
    status: 500,
    description: "Unexpected server error.",
    trigger: "Any unhandled server-side exception.",
  },
  {
    code: "BAD_REQUEST",
    status: 400,
    description: "Malformed request body or invalid query parameters.",
    trigger: "Sending a JSON body missing required fields, or a non-UUID for a UUID param.",
  },
];

function statusColor(status: number): string {
  if (status < 400) return "text-green-400";
  if (status < 500) return "text-brand-warning";
  return "text-brand-error";
}

export default function ErrorCodesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">Error Codes</h1>
      <p className="text-gray-400 mb-6">
        All API errors return this JSON shape:
      </p>
      <div className="bg-brand-surface border border-brand-border rounded-card p-3 font-mono text-sm text-gray-300 mb-8">
        {`{ "error": "ERROR_CODE", "message": "Human readable description" }`}
      </div>

      <div className="bg-brand-surface border border-brand-border rounded-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border text-gray-500 text-xs">
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">HTTP</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Example Trigger</th>
            </tr>
          </thead>
          <tbody>
            {errors.map((err) => (
              <tr key={err.code} className="border-b border-brand-border last:border-0 hover:bg-brand-bg transition-colors">
                <td className="px-4 py-3 align-top">
                  {err.link ? (
                    <a
                      href={err.link}
                      className="font-mono text-xs text-brand-primary hover:underline"
                    >
                      {err.code}
                    </a>
                  ) : (
                    <span className="font-mono text-xs text-brand-primary">{err.code}</span>
                  )}
                </td>
                <td className={`px-4 py-3 align-top font-mono text-xs ${statusColor(err.status)}`}>
                  {err.status}
                </td>
                <td className="px-4 py-3 align-top text-gray-300 text-xs">{err.description}</td>
                <td className="px-4 py-3 align-top text-gray-500 text-xs">{err.trigger}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
