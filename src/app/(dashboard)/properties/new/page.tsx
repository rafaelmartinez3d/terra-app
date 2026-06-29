import PropertyForm from "@/components/property/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Property</h1>
      <div className="bg-white rounded-xl border p-6">
        <PropertyForm />
      </div>
    </div>
  );
}
