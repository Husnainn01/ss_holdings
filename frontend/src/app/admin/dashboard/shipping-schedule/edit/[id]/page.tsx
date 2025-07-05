import ShippingScheduleForm from '@/components/admin/ShippingScheduleForm';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditShippingSchedulePage({ params }: PageProps) {
  return (
    <ShippingScheduleForm 
      scheduleId={params.id} 
      isEditMode={true}
    />
  );
} 