"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setAuthTokens } from "@/utils/auth";

export function AuthComponent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const response = await fetch(
        "https://cognito-idp.ap-northeast-1.amazonaws.com/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
          },
          body: JSON.stringify({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
            AuthParameters: {
              USERNAME: email,
              PASSWORD: password,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "ログインに失敗しました");
      }

      const data = await response.json();

      // setAuthTokens を使用してトークンを保存
      setAuthTokens(
        data.AuthenticationResult.AccessToken,
        data.AuthenticationResult.IdToken
      );

      router.push("/dashboard");
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : "ログインに失敗しました"
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Card className="p-6">
      <form
        onSubmit={handleLogin}
        className="space-y-4"
        method="post"
        autoComplete="on"
      >
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        {loginError && (
          <div className="text-red-500 text-sm text-center">{loginError}</div>
        )}
        <Button type="submit" className="w-full" disabled={isLoggingIn}>
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ログイン中...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              サインイン
            </>
          )}
        </Button>
        <div className="text-center mt-4">
          <Link
            href="/signup"
            className="text-sm text-blue-600 hover:underline"
          >
            アカウントをお持ちでない方はこちら
          </Link>
        </div>
      </form>
    </Card>
  );
}
