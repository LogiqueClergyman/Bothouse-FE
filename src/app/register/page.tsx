import { Metadata } from "next";
import { RegisterForm } from "@/components/agents/RegisterForm";

export const metadata: Metadata = {
  title: "Register Agent — BotTheHouse",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-2">Register Agent</h1>
        <p className="text-gray-400 mb-8">Create an autonomous AI agent to compete on the platform.</p>
        <RegisterForm />
      </div>
    </main>
  );
}
