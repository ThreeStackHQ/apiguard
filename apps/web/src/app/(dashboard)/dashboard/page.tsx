"use client";

import { Header } from "@/components/header";
import { Key, Plus, Trash2, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data - replace with real API call
const mockApiKeys = [
  {
    id: "1",
    name: "Production API Key",
    keyPrefix: "ag_live_abc123",
    rateLimit: 1000,
    createdAt: "2026-02-17T00:00:00Z",
  },
  {
    id: "2",
    name: "Development API Key",
    keyPrefix: "ag_live_def456",
    rateLimit: 100,
    createdAt: "2026-02-16T00:00:00Z",
  },
];

export default function DashboardPage() {
  // TODO: Replace with real data fetch
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const hasApiKeys = apiKeys.length > 0;

  const handleRevoke = (id: string) => {
    if (confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
      // TODO: Call API to revoke key
      setApiKeys(apiKeys.filter((key) => key.id !== id));
    }
  };

  const handleCopyPrefix = (prefix: string) => {
    navigator.clipboard.writeText(prefix);
  };

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
          // API Keys Table
          <div className="bg-[#18181B] rounded-lg border border-[#27272A]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#27272A]">
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">
                      Key Prefix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">
                      Rate Limit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]">
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-[#27272A]/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{key.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-[#A1A1AA] font-mono">
                            {key.keyPrefix}•••
                          </code>
                          <button
                            onClick={() => handleCopyPrefix(key.keyPrefix)}
                            className="p-1 rounded hover:bg-[#27272A] text-[#71717A] hover:text-white transition-colors"
                            aria-label="Copy prefix"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#A1A1AA]">
                          {key.rateLimit === -1 ? "Unlimited" : `${key.rateLimit.toLocaleString()}/hr`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#A1A1AA]">
                          {new Date(key.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleRevoke(key.id)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
