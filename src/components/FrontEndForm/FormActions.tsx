export default function FormActions({ children }: FormActionsProps) {
  return (
    <div className="mt-auto bg-form-nav flex justify-between items-center lg:static fixed lg:bottom-auto bottom-0 lg:inset-auto inset-x-0 lg:z-0 z-10 lg:drop-shadow-none drop-shadow-2xl lg:p-0 p-4 lg:rounded-b-lg text-white">
      {children}
    </div>
  );
}

interface FormActionsProps {
  children: React.ReactNode;
}
