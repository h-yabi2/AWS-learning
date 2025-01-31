"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const idToken = localStorage.getItem("idToken");
        console.log(idToken);

        if (!idToken) {
          throw new Error("認証情報が見つかりません");
        }

        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL as string,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("APIの呼び出しに失敗しました");
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProtectedData();
  }, []);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
        <Card className="p-6">
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  );
}
