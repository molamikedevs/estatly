import AuthShell from "@/components/layout/AuthShell"
import ForgotPasswordForm from "@/features/auth/ForgetPasswordForm"
import { Link } from "react-router-dom"

export default function ForgotPassword() {
  return (
    <AuthShell
      title="Reset your password"
      description="Enter your work email and we'll send a link to choose a new password."
      footer={
        <Link to="/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  )
}
