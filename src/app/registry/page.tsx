import { RegistryList } from "@/components/registry-list";
import { RegistryFilters } from "@/components/registry-filters";
import { Suspense } from "react";

export default function RegistryPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Registry</h1>
      <p className="text-sm text-red-500 mb-6">
        TODO: continue with the registry page
      </p>
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <aside>
          <RegistryFilters />
        </aside>
        <main>
          <Suspense fallback={<div>Loading patients...</div>}>
            <RegistryList />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
