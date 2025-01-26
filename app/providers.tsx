"use client";

// AuthProviderの代わりに他のプロバイダーがある場合
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// もし他のプロバイダーが無い場合は、このファイル自体を削除可能です
