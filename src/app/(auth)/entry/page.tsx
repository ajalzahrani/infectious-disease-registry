import { EntryForm } from "@/app/(auth)/entry/components/entry-form";

export default function EntryPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patient Registration</h1>
      </div>
      <div className="max-w-2xl">
        <EntryForm />
      </div>
    </div>
  );
}
