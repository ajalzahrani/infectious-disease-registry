import { RegistryList } from "@/components/registry-list";
import { RegistryFilters } from "@/components/registry-filters";

export default function RegistryPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Registry</h1>
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <aside>
          <RegistryFilters />
        </aside>
        <main>
          <RegistryList />
        </main>
      </div>
    </div>
  );
}
