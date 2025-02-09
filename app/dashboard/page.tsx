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

interface UserInfo {
  email: string;
  sub: string;
  email_verified: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("idToken="))
          ?.split("=")[1];

        if (!idToken) {
          throw new Error("認証情報が見つかりません");
        }

        // トークンのデコードと userInfo の設定
        const decodedToken = parseJwt(idToken);
        setUserInfo({
          email: decodedToken.email,
          sub: decodedToken.sub,
          email_verified: decodedToken.email_verified,
        });

        // API呼び出し
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL as string,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`APIエラー: ${response.status}`);
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
        deleteCookie("accessToken");
        deleteCookie("idToken");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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

        {/* ユーザー情報カード */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">ユーザー情報</h2>
          <div className="space-y-2">
            <>
              <span className="font-medium">メールアドレス: </span>
              <span>{userInfo?.email}</span>
            </>
            <div>
              <span className="font-medium">ユーザーID: </span>
              <span>{userInfo?.sub}</span>
            </div>
            <div>
              <span className="font-medium">メール認証状況: </span>
              <span
                className={
                  userInfo?.email_verified ? "text-green-600" : "text-red-600"
                }
              >
                {userInfo?.email_verified ? "認証済み" : "未認証"}
              </span>
            </div>
          </div>
        </Card>

        {/* API Gateway レスポンス */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">API レスポンス</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  );
}
