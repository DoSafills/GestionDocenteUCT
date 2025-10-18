import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-4 text-2xl font-semibold">Iniciar sesión</h1>
        <LoginForm />
      </div>
    </div>
  );
}
