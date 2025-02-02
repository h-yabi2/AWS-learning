import { SignUpComponent } from "@/components/signup-component";

export default function SignUpPage() {
  return (
    <div className="container mx-auto max-w-md mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">アカウント作成</h1>
      <SignUpComponent />
    </div>
  );
}
