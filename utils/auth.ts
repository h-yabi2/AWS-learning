/**
 * 認証関連のユーティリティ関数
 */

// トークンのデコード関数
export function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

// トークンをCookieに保存
export const setAuthTokens = (accessToken: string, idToken: string) => {
  document.cookie = `accessToken=${accessToken}; path=/; Secure; SameSite=Strict`;
  document.cookie = `idToken=${idToken}; path=/; Secure; SameSite=Strict`;
};

// Cookieからトークンを削除
export const clearAuthTokens = () => {
  document.cookie = "accessToken=; path=/; Secure; SameSite=Strict";
  document.cookie = "idToken=; path=/; Secure; SameSite=Strict";
};

// API経由でトークンを取得
export const getTokens = async () => {
  const response = await fetch("/api/auth/token", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tokens");
  }

  const data = await response.json();
  return {
    accessToken: data.accessToken,
  };
};

// トークンの有効期限をチェック
export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const { accessToken } = await getTokens();
    const decodedToken = parseJwt(accessToken);
    if (!decodedToken) return true;

    return decodedToken.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};

// ユーザー情報の型定義
export interface UserInfo {
  email: string;
  sub: string;
  email_verified: boolean;
}
