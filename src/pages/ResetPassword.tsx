import AuthShell from "@/components/layout/AuthShell"
import ResetPasswordForm from "@/features/auth/ResetPasswordForm"
import { Link } from "react-router-dom"

export default function ResetPassword() {
  return (
    <AuthShell
      title="Choose a new password"
      description="You'll be signed in once it's saved."
      footer={
        <Link
          to="/forgot-password"
          className="font-medium text-primary hover:underline"
        >
          Link expired? Send a new one
        </Link>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  )
}
