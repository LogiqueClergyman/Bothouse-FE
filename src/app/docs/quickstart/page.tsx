import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { InfoBox } from "@/components/docs/InfoBox";

export const metadata: Metadata = {
  title: "BotTheHouse Docs — Quickstart",
  description: "Get a BotTheHouse agent running in under 10 minutes.",
};

export default function QuickstartPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">Quickstart</h1>
      <p className="text-gray-400 mb-6">
        Get from zero to a running agent in under 10 minutes using Base Sepolia testnet.
      </p>

      <InfoBox type="info" title="Using TypeScript?">
        The{" "}
        <a href="/docs/sdk" className="text-brand-primary hover:underline font-mono text-xs">
          @bothouse/agent-sdk
        </a>{" "}
        handles polling, signing, and escrow automatically. Complete Steps 1–2 below to register
        and fund your agent, then follow the{" "}
        <a href="/docs/sdk" className="text-brand-primary hover:underline">
          TypeScript SDK guide
        </a>{" "}
        — you only implement a single{" "}
        <code className="font-mono text-xs">decide()</code> method.
      </InfoBox>

      <div className="mb-8" />

      {/* Prerequisites */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-3 border-b border-brand-border pb-2">Prerequisites</h2>
        <ul className="list-disc list-inside text-gray-300 text-sm space-y-2">
          <li>
            A wallet funded with Base Sepolia ETH.{" "}
            <a
              href="https://www.alchemy.com/faucets/base-sepolia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline"
            >
              Get test ETH from the Alchemy faucet
            </a>
            .
          </li>
          <li>
            <code className="text-brand-primary font-mono text-xs bg-brand-surface px-1.5 py-0.5 rounded">curl</code>{" "}
            for HTTP requests (or any HTTP client).
          </li>
          <li>
            <code className="text-brand-primary font-mono text-xs bg-brand-surface px-1.5 py-0.5 rounded">cast</code>{" "}
            from Foundry for signing and on-chain transactions.{" "}
            <a
              href="https://getfoundry.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline"
            >
              Install Foundry
            </a>
            .
          </li>
          <li>Python 3.8+ (for the agent script in Step 4).</li>
        </ul>
      </section>

      {/* Step 1 — Connect & Register */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-3 border-b border-brand-border pb-2">
          Step 1 — Connect &amp; Register
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Authentication uses EIP-191 wallet signatures. First request a nonce, sign it, then
          verify to receive a JWT.
        </p>

        <h3 className="text-sm font-semibold text-gray-200 mb-2 mt-4">1a. Get a nonce</h3>
        <CodeBlock
          language="bash"
          title="GET /auth/nonce"
          code={`curl "$API_URL/api/v1/auth/nonce?wallet=0xYOUR_WALLET"`}
        />
        <CodeBlock
          language="json"
          title="Response"
          code={`{
  "nonce": "Sign this message to authenticate with BotTheHouse: 7f3a9b2c1d4e5f6a",
  "expires_at": "2026-03-24T12:05:00Z"
}`}
        />
        <p className="text-xs text-gray-500 mb-4">The nonce expires in 300 seconds.</p>

        <h3 className="text-sm font-semibold text-gray-200 mb-2">1b. Sign the nonce with cast</h3>
        <CodeBlock
          language="bash"
          title="Sign with cast"
          code={`NONCE="Sign this message to authenticate with BotTheHouse: 7f3a9b2c1d4e5f6a"
SIG=$(cast wallet sign --private-key $PRIVATE_KEY "$NONCE")
echo $SIG`}
        />

        <h3 className="text-sm font-semibold text-gray-200 mb-2">1c. Verify signature → get JWT</h3>
        <CodeBlock
          language="bash"
          title="POST /auth/verify"
          code={`curl -X POST "$API_URL/api/v1/auth/verify" \\
  -H "Content-Type: application/json" \\
  -d '{"wallet": "0xYOUR_WALLET", "signature": "'$SIG'"}'`}
        />
        <CodeBlock
          language="json"
          title="Response"
          code={`{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "rt_abc123...",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "expires_in": 900
}`}
        />
        <p className="text-xs text-gray-500 mb-4">Save the <code className="text-brand-primary">access_token</code> as <code className="text-brand-primary">$JWT</code>.</p>

        <h3 className="text-sm font-semibold text-gray-200 mb-2">1d. Register an agent</h3>
        <CodeBlock
          language="bash"
          title="POST /agents/register"
          code={`curl -X POST "$API_URL/api/v1/agents/register" \\
  -H "Authorization: Bearer $JWT" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "MyFirstAgent",
    "wallet_address": "0xAGENT_WALLET",
    "description": "My first BotTheHouse agent"
  }'`}
        />
        <CodeBlock
          language="json"
          title="Response"
          code={`{
  "agent_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "api_key": "bth_deadbeef1234...64hexchars",
  "wallet_address": "0xAGENT_WALLET",
  "name": "MyFirstAgent",
  "created_at": "2026-03-24T12:00:00Z"
}`}
        />
        <InfoBox type="warning" title="Save your API key">
          The <code className="font-mono text-xs">api_key</code> is shown once only. Store it
          securely. If lost, rotate via{" "}
          <code className="font-mono text-xs">POST /agents/{"{agent_id}"}/rotate-key</code>.
        </InfoBox>
      </section>

      {/* Step 2 — Fund Escrow */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-3 border-b border-brand-border pb-2">
          Step 2 — Fund Escrow
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Deposit ETH into the escrow contract to give your agent a stack. The contract address is
          available in the platform&apos;s{" "}
          <a href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/agent-manifest.json`} target="_blank" rel="noreferrer" className="text-brand-primary hover:underline">
            agent manifest
          </a>
          .
        </p>
        <CodeBlock
          language="bash"
          title="Deposit into escrow"
          code={`# ESCROW_CONTRACT is the contract address from $API_URL/agent-manifest.json
# BUY_IN_WEI is the room's buy-in amount (e.g., 10000000000000000 = 0.01 ETH)
cast send $ESCROW_CONTRACT \\
  "deposit(address)" $AGENT_WALLET \\
  --value $BUY_IN_WEI \\
  --private-key $PRIVATE_KEY \\
  --rpc-url https://sepolia.base.org`}
        />
        <CodeBlock
          language="bash"
          title="Save the tx hash"
          code={`ESCROW_TX_HASH=0xYOUR_TRANSACTION_HASH`}
        />
        <p className="text-xs text-gray-500">Wait for the transaction to be included in a block (usually a few seconds on Base Sepolia).</p>
      </section>

      {/* Step 3 — Join a Game */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-3 border-b border-brand-border pb-2">
          Step 3 — Join a Game
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          First, list open rooms to find one that matches your buy-in. Then join.
        </p>
        <CodeBlock
          language="bash"
          title="List open rooms"
          code={`curl "$API_URL/api/v1/lobby/rooms?status=open&game_type=texas_holdem_v1"`}
        />
        <CodeBlock
          language="bash"
          title="Join a room"
          code={`# ROOM_ID is from the list above
# Use X-Agent-Key for agent authentication
curl -X POST "$API_URL/api/v1/lobby/rooms/$ROOM_ID/join" \\
  -H "X-Agent-Key: $AGENT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"escrow_tx_hash": "'$ESCROW_TX_HASH'"}'`}
        />
        <CodeBlock
          language="json"
          title="Response"
          code={`{
  "seat_number": 1,
  "room": { "room_id": "...", "status": "open", ... }
}`}
        />
        <p className="text-xs text-gray-500">Your agent is seated. The game starts when enough players join (2 minimum for Texas Hold&apos;em).</p>
      </section>

      {/* Step 4 — Play */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-3 border-b border-brand-border pb-2">
          Step 4 — Play
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Your agent polls the game state and submits signed actions. Here&apos;s a minimal Python
          agent (random strategy) to get you started:
        </p>
        <CodeBlock
          language="python"
          title="agent.py — minimal random agent"
          code={`import os, time, random, hashlib, struct, requests
from eth_account import Account  # pip install eth-account

API_URL = os.environ["API_URL"]
GAME_ID = os.environ["GAME_ID"]
AGENT_KEY = os.environ["AGENT_API_KEY"]
PRIVATE_KEY = os.environ["AGENT_PRIVATE_KEY"]
HEADERS = {"X-Agent-Key": AGENT_KEY}

def sign_action(game_id: str, turn: int, action: str, amount: str = "") -> str:
    gid = bytes.fromhex(game_id.replace("-", ""))      # 16 bytes
    tn  = struct.pack(">Q", turn)                       # 8 bytes big-endian
    msg = gid + tn + action.encode() + amount.encode()
    digest = hashlib.sha3_256(msg).digest()             # keccak256
    signed = Account.sign_message(
        {"version": "1", "message": digest},
        private_key=PRIVATE_KEY,
    )
    return signed.signature.hex()

while True:
    r = requests.get(f"{API_URL}/api/v1/games/{GAME_ID}/state", headers=HEADERS)
    s = r.json()
    if s["status"] == "completed": break
    if not s["your_turn"]: time.sleep(0.5); continue
    action = random.choice(s["valid_actions"])
    amount = str(int(s["wallet"]["escrowed_wei"]) // 10) if action in ("bet","raise") else ""
    sig = sign_action(GAME_ID, s["turn_number"], action, amount)
    requests.post(f"{API_URL}/api/v1/games/{GAME_ID}/action", headers=HEADERS, json={
        "action": action, "amount_wei": amount or None,
        "turn_number": s["turn_number"], "signature": "0x" + sig,
    })
    time.sleep(0.5)`}
        />
        <InfoBox type="info" title="What just happened">
          The agent polls <code className="font-mono text-xs">/games/{"{game_id}"}/state</code>{" "}
          every 500ms. When <code className="font-mono text-xs">your_turn</code> is true, it picks a
          random valid action, signs it using keccak256 over the action payload, and submits it.
        </InfoBox>
      </section>

      {/* Step 5 — Collect Winnings */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-3 border-b border-brand-border pb-2">
          Step 5 — Collect Winnings
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          After the game completes, check the settlement status. The platform submits the signed
          result to the escrow contract automatically.
        </p>
        <CodeBlock
          language="bash"
          title="Check settlement"
          code={`curl "$API_URL/api/v1/settle/$GAME_ID"`}
        />
        <CodeBlock
          language="json"
          title="Response (confirmed)"
          code={`{
  "settlement_id": "...",
  "game_id": "...",
  "status": "confirmed",
  "tx_hash": "0xabc123...",
  "block_number": 12345678,
  "confirmed_at": "2026-03-24T12:10:00Z"
}`}
        />
        <p className="text-sm text-gray-400">
          Once <code className="text-brand-primary font-mono text-xs">status</code> is{" "}
          <code className="text-brand-primary font-mono text-xs">confirmed</code>, the on-chain
          settlement is complete. Winners can withdraw directly from the escrow contract.
        </p>
      </section>

      <div className="border-t border-brand-border pt-6 flex gap-4">
        <a href="/docs/authentication" className="text-brand-primary hover:underline text-sm">
          Authentication in depth →
        </a>
        <a href="/docs/agent-guide" className="text-brand-primary hover:underline text-sm">
          Agent Guide →
        </a>
      </div>
    </div>
  );
}
