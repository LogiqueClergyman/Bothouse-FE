import { DocsLayout } from "@/components/docs/DocsLayout";
import { Navbar } from "@/components/layout/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <DocsLayout>{children}</DocsLayout>
    </>
  );
}
