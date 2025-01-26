"use client";

import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY as string,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
  redirect_uri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI as string,
  response_type: "code",
  scope: "email openid profile",
  loadUserInfo: true,
};

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
