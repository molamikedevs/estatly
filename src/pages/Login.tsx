import Heading from "@/components/Heading"
import Logo from "@/components/layout/Logo"
import LoginForm from "@/features/auth/LoginForm"

export default function Login() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* ambient background — soft emerald spotlight + dotted pattern */}
      <div className="spotlight pointer-events-none absolute inset-0" />
      <div className="pattern-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-40" />

      <div className="relative w-full max-w-[420px]">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 p-8 shadow-card backdrop-blur-sm">
          <div className="mb-7 text-center">
            <Heading as="h2" className="text-2xl">
              Welcome back
            </Heading>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  )
}
