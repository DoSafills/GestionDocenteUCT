
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* SIN max-w-sm, SIN containers que achiquen */}
      <div className="w-full h-full flex items-center justify-center">
        <LoginForm />
      </div>
    </main>
  );
}
