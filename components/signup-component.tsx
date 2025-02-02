"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignUpComponent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);
    setError("");

    // パスワード確認
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      setIsSigningUp(false);
      return;
    }

    try {
      const response = await fetch(
        "https://cognito-idp.ap-northeast-1.amazonaws.com/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp",
          },
          body: JSON.stringify({
            ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
            Username: email,
            Password: password,
            UserAttributes: [
              {
                Name: "email",
                Value: email,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "アカウント作成に失敗しました");
      }

      const data = await response.json();
      console.log("SignUp successful:", data);

      // 確認コード入力ページへリダイレクト
      router.push(`/confirm?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "アカウント作成に失敗しました"
      );
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <Card className="p-6">
      <form
        onSubmit={handleSignUp}
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
            autoComplete="new-password"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">パスワード（確認）</Label>
          <Input
            id="confirm-password"
            name="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <Button type="submit" className="w-full" disabled={isSigningUp}>
          {isSigningUp ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              アカウント作成中...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              アカウント作成
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
