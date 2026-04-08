"use client";
import { useState } from "react";
import { createApi } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { CHAIN_TYPE } from "@/lib/chain-provider";

// ─── EVM variant ─────────────────────────────────────────────────────────────

function RegisterFormEvm() {
  const { useConnect, useSignMessage, useAccount } = require("wagmi");
  const { injected } = require("wagmi/connectors");
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { signMessageAsync } = useSignMessage();

  return (
    <RegisterFormInner
      address={address}
      isConnected={isConnected}
      connectButton={
        <button
          type="button"
          data-agent-action="connect-wallet"
          onClick={() => connect({ connector: injected() })}
          className="w-full bg-brand-primary text-black py-3 rounded-card font-bold"
        >
          Connect Wallet
        </button>
      }
      signMessage={(msg: string) => signMessageAsync({ message: msg })}
    />
  );
}

// ─── OneChain variant ─────────────────────────────────────────────────────────

function RegisterFormOneChain() {
  const {
    useCurrentAccount,
    useSignPersonalMessage,
    ConnectModal,
  } = require("@onelabs/dapp-kit");
  require("@onelabs/dapp-kit/dist/index.css");

  const account = useCurrentAccount();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <RegisterFormInner
      address={account?.address}
      isConnected={!!account}
      connectButton={
        <ConnectModal
          trigger={
            <button
              type="button"
              data-agent-action="connect-wallet"
              className="w-full bg-brand-primary text-black py-3 rounded-card font-bold"
            >
              Connect Wallet
            </button>
          }
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      }
      signMessage={async (msg: string) => {
        const { signature } = await signPersonalMessage({
          message: new TextEncoder().encode(msg),
        });
        return signature;
      }}
    />
  );
}

// ─── Shared form ─────────────────────────────────────────────────────────────

function RegisterFormInner({
  address,
  isConnected,
  connectButton,
  signMessage,
}: {
  address: string | undefined;
  isConnected: boolean;
  connectButton: React.ReactNode;
  signMessage: (msg: string) => Promise<string>;
}) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setError(null);
    setLoading(true);
    try {
      const api = createApi();
      const { nonce } = await api.getNonce(address);
      const signature = await signMessage(nonce);
      const { access_token, refresh_token, user_id } = await api.verify(address, signature);
      setAuth({ user_id, wallet: address }, access_token, refresh_token);
      const authedApi = createApi(access_token);
      const res = await authedApi.registerAgent({
        name,
        wallet_address: address,
        description: description || undefined,
        webhook_url: webhookUrl || undefined,
      });
      setApiKey(res.api_key);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (apiKey) {
    return (
      <div className="bg-brand-surface rounded-card p-8 border border-brand-primary">
        <h2 className="text-xl font-bold mb-2 text-brand-primary">Agent Registered!</h2>
        <p className="text-brand-warning font-semibold mb-4">Save this key. It will not be shown again.</p>
        <div className="bg-brand-bg rounded p-4 font-mono text-sm break-all mb-4">{apiKey}</div>
        <button
          onClick={() => navigator.clipboard.writeText(apiKey)}
          className="bg-brand-primary text-black px-4 py-2 rounded-input font-semibold"
        >
          Copy API Key
        </button>
      </div>
    );
  }

  return (
    <form data-agent-form="register" onSubmit={handleSubmit} className="bg-brand-surface rounded-card p-8 border border-brand-border space-y-6">
      {!isConnected ? (
        connectButton
      ) : (
        <div className="text-sm text-gray-400">
          Connected: <span className="font-mono text-white">{address}</span>
        </div>
      )}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Name *</label>
        <input
          data-agent-field="name"
          name="name"
          type="text"
          required
          maxLength={32}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-brand-bg border border-brand-border rounded-input px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Wallet Address *</label>
        <input
          data-agent-field="wallet_address"
          name="wallet_address"
          type="text"
          required
          value={address ?? ""}
          readOnly
          className="w-full bg-brand-bg border border-brand-border rounded-input px-3 py-2 text-gray-400 font-mono"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Description</label>
        <textarea
          maxLength={256}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-brand-bg border border-brand-border rounded-input px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Webhook URL</label>
        <input
          data-agent-field="webhook_url"
          name="webhook_url"
          type="url"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          className="w-full bg-brand-bg border border-brand-border rounded-input px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
        />
      </div>
      {error && <div className="text-brand-error text-sm">{error}</div>}
      <button
        data-agent-action="register"
        type="submit"
        disabled={loading || !isConnected}
        className="w-full bg-brand-primary text-black py-3 rounded-card font-bold disabled:opacity-50"
      >
        {loading ? "Registering..." : "Register Agent"}
      </button>
    </form>
  );
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export function RegisterForm() {
  return CHAIN_TYPE === "onechain" ? <RegisterFormOneChain /> : <RegisterFormEvm />;
}
