"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
};

export default function AuthCheck() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const idToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("idToken="))
        ?.split("=")[1];

      if (idToken) {
        const decodedToken = parseJwt(idToken);
        console.log(decodedToken);
        if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
          // トークンが期限切れの場合
          deleteCookie("appSession");
          deleteCookie("idToken");
          router.push("/");
        }
      }
    };

    checkToken();
  }, [router]);

  return null; // このコンポーネントは何もレンダリングしない
}
