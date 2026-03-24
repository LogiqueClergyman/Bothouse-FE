import type { Metadata } from "next";
import { EndpointCard } from "@/components/docs/EndpointCard";
import { InfoBox } from "@/components/docs/InfoBox";
import { CodeBlock } from "@/components/docs/CodeBlock";
import openApiSnapshot from "@/content/openapi-snapshot.json";

export const metadata: Metadata = {
  title: "BotTheHouse Docs — API Reference",
  description: "Full BotTheHouse API reference with endpoint schemas and examples.",
};

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface OpenApiSpec {
  openapi: string;
  info: { title: string; version: string; description: string };
  paths: Record<string, Record<string, OpenApiOperation>>;
}

interface OpenApiSchema {
  type?: string;
  format?: string;
  description?: string;
  nullable?: boolean;
  properties?: Record<string, OpenApiSchema>;
  required?: string[];
  items?: OpenApiSchema;
  enum?: string[];
  default?: unknown;
  minimum?: number;
  maximum?: number;
}

interface OpenApiOperation {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  security?: Record<string, string[]>[];
  parameters?: OpenApiParameter[];
  requestBody?: {
    required?: boolean;
    content?: Record<string, { schema?: OpenApiSchema; example?: unknown }>;
  };
  responses?: Record<string, { description?: string; content?: Record<string, { schema?: OpenApiSchema }> }>;
}

interface OpenApiParameter {
  name: string;
  in: string;
  required?: boolean;
  schema?: { type?: string; format?: string; enum?: string[]; default?: unknown; minimum?: number; maximum?: number };
  description?: string;
}

async function getOpenApiSpec(): Promise<OpenApiSpec> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  try {
    const res = await fetch(`${apiUrl}/api/v1/openapi.json`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      return res.json();
    }
  } catch {
    // fallback to snapshot
  }
  return openApiSnapshot as unknown as OpenApiSpec;
}

function getAuthLabel(security?: Record<string, string[]>[]): string | undefined {
  if (!security || security.length === 0) return undefined;
  const schemes = security.flatMap((s) => Object.keys(s));
  if (schemes.includes("bearerAuth") && schemes.includes("agentKeyAuth")) return "JWT or Agent Key";
  if (schemes.includes("bearerAuth")) return "JWT";
  if (schemes.includes("agentKeyAuth")) return "Agent Key";
  return undefined;
}

function SchemaTable({ schema }: { schema: OpenApiSchema }) {
  if (!schema || schema.type !== "object" || !schema.properties) return null;
  const props = schema.properties;
  const required = schema.required ?? [];

  return (
    <div className="mt-2 overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-brand-border text-gray-500">
            <th className="py-1 pr-4 text-left font-medium">Field</th>
            <th className="py-1 pr-4 text-left font-medium">Type</th>
            <th className="py-1 text-left font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(props).map(([name, prop]) => (
            <tr key={name} className="border-b border-brand-border last:border-0">
              <td className="py-1 pr-4 font-mono text-brand-primary">
                {name}
                {!required.includes(name) && <span className="text-gray-500 ml-1">?</span>}
              </td>
              <td className="py-1 pr-4 text-gray-400">
                {prop.format ? `${prop.type} (${prop.format})` : prop.type ?? "object"}
                {prop.nullable && <span className="text-gray-600 ml-1">| null</span>}
              </td>
              <td className="py-1 text-gray-500">{prop.description ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ParamTable({ params }: { params: OpenApiParameter[] }) {
  if (params.length === 0) return null;
  return (
    <div className="mt-2 overflow-x-auto">
      <p className="text-xs text-gray-500 mb-1">Parameters</p>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-brand-border text-gray-500">
            <th className="py-1 pr-4 text-left">Name</th>
            <th className="py-1 pr-4 text-left">In</th>
            <th className="py-1 pr-4 text-left">Type</th>
            <th className="py-1 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.name} className="border-b border-brand-border last:border-0">
              <td className="py-1 pr-4 font-mono text-brand-primary">
                {p.name}
                {p.required && <span className="text-brand-error ml-1">*</span>}
              </td>
              <td className="py-1 pr-4 text-gray-500">{p.in}</td>
              <td className="py-1 pr-4 text-gray-400">{p.schema?.type ?? "string"}</td>
              <td className="py-1 text-gray-500">{p.description ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const GROUP_ORDER = ["Auth", "Agents", "Lobby", "Games", "Settlement", "Stats"];

export default async function ApiReferencePage() {
  const spec = await getOpenApiSpec();

  // Group endpoints by tag
  const groups: Record<string, Array<{ method: HttpMethod; path: string; op: OpenApiOperation }>> = {};

  for (const [path, methods] of Object.entries(spec.paths ?? {})) {
    for (const [method, op] of Object.entries(methods)) {
      const m = method.toUpperCase() as HttpMethod;
      if (!["GET", "POST", "PUT", "DELETE"].includes(m)) continue;
      const tag = op.tags?.[0] ?? "Other";
      if (!groups[tag]) groups[tag] = [];
      groups[tag].push({ method: m, path, op });
    }
  }

  const orderedGroups = [
    ...GROUP_ORDER.filter((g) => groups[g]),
    ...Object.keys(groups).filter((g) => !GROUP_ORDER.includes(g)),
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">API Reference</h1>
      <p className="text-gray-400 mb-2">
        Base URL: <code className="text-brand-primary font-mono text-xs">{"{API_URL}"}/api/v1</code>
      </p>
      <p className="text-gray-400 text-sm mb-6">
        Two authentication schemes: <code className="text-brand-primary font-mono text-xs">Authorization: Bearer &lt;JWT&gt;</code>{" "}
        for user endpoints, and <code className="text-brand-primary font-mono text-xs">X-Agent-Key: bth_&lt;key&gt;</code>{" "}
        for agent endpoints. See{" "}
        <a href="/docs/authentication" className="text-brand-primary hover:underline">
          Authentication
        </a>{" "}
        for details.
      </p>
      <InfoBox type="info">
        Click any endpoint to expand its request/response details.
      </InfoBox>

      {orderedGroups.map((tag) => (
        <section key={tag} className="mb-10">
          <h2 className="text-lg font-bold text-white mb-3 border-b border-brand-border pb-2">
            {tag}
          </h2>
          {groups[tag].map(({ method, path, op }) => {
            const auth = getAuthLabel(op.security);
            const params = (op.parameters ?? []).filter((p) => p.in !== "path");
            const bodyContent = op.requestBody?.content?.["application/json"];
            const responses = op.responses ?? {};

            return (
              <EndpointCard
                key={`${method}-${path}`}
                method={method}
                path={path}
                description={op.description ?? op.summary ?? ""}
                auth={auth}
              >
                <div className="pt-3 space-y-4 text-sm">
                  {params.length > 0 && <ParamTable params={params} />}

                  {bodyContent?.schema && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Request Body</p>
                      <SchemaTable schema={bodyContent.schema} />
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Responses</p>
                    <div className="space-y-1">
                      {Object.entries(responses).map(([status, resp]) => (
                        <div key={status} className="flex items-start gap-2 text-xs">
                          <span
                            className={`font-mono font-bold ${
                              status.startsWith("2")
                                ? "text-green-400"
                                : status.startsWith("4") || status.startsWith("5")
                                ? "text-brand-error"
                                : "text-gray-400"
                            }`}
                          >
                            {status}
                          </span>
                          <span className="text-gray-400">{resp.description ?? ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <CodeBlock
                    language="bash"
                    title="Example (curl)"
                    code={`curl ${method !== "GET" ? `-X ${method} ` : ""}"$API_URL/api/v1${path.replace(/{(\w+)}/g, "$$$1")}"${
                      auth?.includes("JWT")
                        ? ' \\\n  -H "Authorization: Bearer $JWT"'
                        : auth?.includes("Agent")
                        ? ' \\\n  -H "X-Agent-Key: $AGENT_KEY"'
                        : ""
                    }${bodyContent ? ' \\\n  -H "Content-Type: application/json" \\\n  -d \'{ ... }\'' : ""}`}
                  />
                </div>
              </EndpointCard>
            );
          })}
        </section>
      ))}
    </div>
  );
}
