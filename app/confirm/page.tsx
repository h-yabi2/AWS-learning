"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [code, setCode] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirming(true);
    setError("");

    try {
      const response = await fetch(
        "https://cognito-idp.ap-northeast-1.amazonaws.com/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.ConfirmSignUp",
          },
          body: JSON.stringify({
            ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
            Username: email,
            ConfirmationCode: code,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "確認に失敗しました");
      }

      // 確認成功後、ダッシュボードページへリダイレクト
      router.push("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "確認コードの検証に失敗しました"
      );
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleConfirm} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">確認コード</Label>
          <Input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="確認コードを入力してください"
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <Button type="submit" className="w-full" disabled={isConfirming}>
          {isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              確認中...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              確認
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
