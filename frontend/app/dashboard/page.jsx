import AuthenticatedRoute from "@/app/features/AuthenticatedRoute";
import DashboardForm from "@/app/features/DashboardForm";

export default function Page() {
  return (
    <AuthenticatedRoute>
      <DashboardForm />
    </AuthenticatedRoute>
  );
}
