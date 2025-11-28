import AuthenticatedRoute from "@/app/services/AuthenticatedRoute";
import DashboardForm from "@/app/services/DashboardForm";

export default function Page() {
  return (
    <AuthenticatedRoute>
      <DashboardForm />
    </AuthenticatedRoute>
  );
}
