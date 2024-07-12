import { SignInForm } from "./SignInForm";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/admin/schools");
  }

  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className="w-full max-w-xl space-y-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          TSA Enrolment Login
        </h2>
        <SignInForm />
      </div>
    </main>
  );
}
