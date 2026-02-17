import { Suspense } from "react";
import { Header } from "@/components/header";
import { ApiKeyDisplay } from "@/components/api-key-display";

export default function ApiKeySuccessPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "API Keys", href: "/dashboard" },
          { label: "Success" },
        ]}
      />

      <div className="flex-1 p-6 flex items-center justify-center">
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <ApiKeyDisplay />
        </Suspense>
      </div>
    </div>
  );
}
