"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");

      if (!code) {
        setError("認証コードが見つかりません");
        return;
      }

      try {
        // Cognitoトークンエンドポイントにコードを送信
        const response = await fetch(
          `https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
              code: code,
              redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("トークンの取得に失敗しました");
        }

        const data = await response.json();

        // トークンを保存
        document.cookie = `idToken=${data.id_token}; path=/;`;
        document.cookie = `accessToken=${data.access_token}; path=/;`;

        // ダッシュボードへリダイレクト
        router.push("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "認証に失敗しました");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return <div>認証中...</div>;
}
