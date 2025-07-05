import ShippingScheduleForm from '@/components/admin/ShippingScheduleForm';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditShippingSchedulePage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <ShippingScheduleForm 
      scheduleId={id} 
      isEditMode={true}
    />
  );
} 