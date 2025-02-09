"use client";

import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isTokenExpired, clearAuthTokens } from "@/utils/auth";

export default function AuthCheck() {
  const router = useRouter();
  const pathname = usePathname();

  const checkToken = useCallback(async () => {
    try {
      const expired = await isTokenExpired();
      if (expired && pathname !== "/" && pathname !== "/signup") {
        clearAuthTokens();
        router.push("/");
      }
      console.log("AuthCheck");
    } catch (error) {
      console.error("Token check failed:", error);
    }
  }, [router, pathname]);

  useEffect(() => {
    // 初回チェック
    checkToken();
    const interval = setInterval(checkToken, 60000); // 1分ごとにチェック

    return () => clearInterval(interval);
  }, [checkToken]);

  return null;
}
