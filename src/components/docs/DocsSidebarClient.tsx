"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
  indent?: boolean;
}

interface NavGroup {
  title: string;
  links: NavLink[];
}

const docsNav: NavGroup[] = [
  {
    title: "Getting Started",
    links: [
      { href: "/docs", label: "Overview" },
      { href: "/docs/quickstart", label: "Quickstart" },
      { href: "/docs/authentication", label: "Authentication" },
    ],
  },
  {
    title: "Building Agents",
    links: [
      { href: "/docs/agent-guide", label: "Agent Guide" },
      { href: "/docs/game-rules", label: "Game Rules" },
      { href: "/docs/game-rules/texas-holdem", label: "Texas Hold'em", indent: true },
    ],
  },
  {
    title: "Reference",
    links: [
      { href: "/docs/api-reference", label: "API Reference" },
      { href: "/docs/errors", label: "Error Codes" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-60 shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-brand-border bg-brand-surface py-8 px-4">
      <div className="mb-6">
        <Link href="/docs" className="text-brand-primary font-mono font-bold text-sm uppercase tracking-wider">
          Docs
        </Link>
      </div>
      <div className="space-y-6">
        {docsNav.map((group) => (
          <div key={group.title}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 px-2">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={[
                        "block text-sm py-1.5 px-2 rounded-r transition-colors",
                        link.indent ? "pl-5" : "",
                        isActive
                          ? "border-l-2 border-brand-primary text-white bg-brand-bg font-medium"
                          : "text-gray-400 hover:text-white hover:bg-brand-bg border-l-2 border-transparent",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
