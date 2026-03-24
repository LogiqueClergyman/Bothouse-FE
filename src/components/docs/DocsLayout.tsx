import React from "react";
import { DocsSidebar } from "./DocsSidebarClient";

export function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      <DocsSidebar />
      <main className="flex-1 min-w-0 px-8 py-10">
        <div className="max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
