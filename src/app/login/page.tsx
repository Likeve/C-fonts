import { Suspense } from"react";
import LoginClient from"./LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
