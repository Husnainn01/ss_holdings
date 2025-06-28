import CarForm from "@/components/admin/CarForm";

export default function NewCar() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Car</h1>
      </div>
      
      <CarForm />
    </div>
  );
} 