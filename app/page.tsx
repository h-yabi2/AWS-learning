import { AuthComponent } from '@/components/auth-component';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Cognito認証デモ</h1>
        <AuthComponent />
      </div>
    </div>
  );
}