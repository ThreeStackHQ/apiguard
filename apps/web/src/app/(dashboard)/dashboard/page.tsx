import { Header } from "@/components/header";
import { Key, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // TODO: Replace with real data check
  const hasApiKeys = false;

  return (
    <div className="flex flex-col h-screen">
      <Header
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "API Keys" },
        ]}
        ctaText="Create API Key"
        ctaHref="/dashboard/keys/new"
      />

      <div className="flex-1 p-6">
        {hasApiKeys ? (
          // TODO: Replace with API keys table
          <div className="text-white">API Keys Table (coming soon)</div>
        ) : (
          // Empty state
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              {/* Icon */}
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#3C83F6]/10 border border-[#3C83F6]/20">
                <Key className="h-8 w-8 text-[#3C83F6]" />
              </div>

              {/* Heading */}
              <h2 className="text-2xl font-semibold text-white mb-3">
                Create your first API key
              </h2>

              {/* Description */}
              <p className="text-[#A1A1AA] mb-8">
                Get started by creating an API key. You'll be able to use it to authenticate your applications and track usage.
              </p>

              {/* CTA Button */}
              <Link
                href="/dashboard/keys/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#3C83F6] text-white text-sm font-medium hover:bg-[#2563EB] transition-colors shadow-lg shadow-[#3C83F6]/20"
              >
                <Plus className="h-5 w-5" />
                Get Started
              </Link>

              {/* Helper text */}
              <p className="mt-6 text-xs text-[#71717A]">
                Need help? Check out our{" "}
                <a
                  href="/docs"
                  className="text-[#3C83F6] hover:underline"
                >
                  documentation
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
