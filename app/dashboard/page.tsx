"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

// トークンのデコード関数
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const deleteCookie = (name: string) => {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    };

    const fetchProtectedData = async () => {
      try {
        const idToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("idToken="))
          ?.split("=")[1];

        if (!idToken) {
          throw new Error("認証情報が見つかりません");
        }

        // トークン有効期限の簡易チェック
        const decodedToken = parseJwt(idToken);
        if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
          // cookie 削除
          deleteCookie("appSession");
          deleteCookie("idToken");

          throw new Error(
            "セッションの有効期限が切れました。再度ログインしてください。"
          );
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
        // ログアウト処理
        deleteCookie("appSession");
        deleteCookie("idToken");
        router.push("/");
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
