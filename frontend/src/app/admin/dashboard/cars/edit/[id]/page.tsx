"use client";

import CarForm from "@/components/admin/CarForm";
import { useParams } from "next/navigation";

export default function EditCar() {
  const params = useParams();
  const carId = (params?.id ?? '') as string;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Car</h1>
      </div>
      
      <CarForm id={carId} isEditMode={true} />
    </div>
  );
} 