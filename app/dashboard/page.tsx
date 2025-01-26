import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

export default function DashboardPage() {
  return (
    <div>
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
        <Card className="p-6">
          <p>ダッシュボードへようこそ！</p>
        </Card>
      </div>
    </div>
  );
}
